import React, { useState, useEffect } from "react";
import { reservaService } from "../services/reservaService";

/**
 * ReservaForm - Formulario para crear una reserva con múltiples mesas
 * Usa FormData + defaultValue según arquitectura
 */
const ReservaForm = ({ restaurante, onSubmit, onCancel, loading }) => {
    const [disponibilidad, setDisponibilidad] = useState(null);
    const [fecha, setFecha] = useState("");
    const [mesasSeleccionadas, setMesasSeleccionadas] = useState([]);
    const [loadingDisp, setLoadingDisp] = useState(false);

    // Obtener fecha mínima (hoy)
    const today = new Date().toISOString().split("T")[0];

    // Verificar disponibilidad cuando cambia la fecha
    useEffect(() => {
        const verificarDisponibilidad = async () => {
            if (fecha && restaurante) {
                setLoadingDisp(true);
                setMesasSeleccionadas([]); // Reset selección al cambiar fecha
                try {
                    const disp = await reservaService.getDisponibilidad(restaurante.id, fecha);
                    setDisponibilidad(disp);
                } catch (error) {
                    console.error("Error verificando disponibilidad:", error);
                } finally {
                    setLoadingDisp(false);
                }
            }
        };
        verificarDisponibilidad();
    }, [fecha, restaurante]);

    // Toggle mesa seleccionada
    const toggleMesa = (mesa) => {
        setMesasSeleccionadas(prev => {
            if (prev.includes(mesa)) {
                return prev.filter(m => m !== mesa);
            } else {
                return [...prev, mesa].sort((a, b) => a - b);
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // Agregar mesas seleccionadas
        formData.set('mesas', mesasSeleccionadas.join(','));
        onSubmit(formData);
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            <i className="bi bi-calendar-plus me-2"></i>
                            Reservar Mesas
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onCancel}
                            disabled={loading}
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Info del restaurante */}
                            <div className="alert alert-light d-flex align-items-center mb-4">
                                <img
                                    src={restaurante?.foto_url || "https://picsum.photos/60/60?grayscale"}
                                    alt={restaurante?.nombre}
                                    className="rounded me-3"
                                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                />
                                <div>
                                    <h6 className="mb-1">{restaurante?.nombre}</h6>
                                    <small className="text-muted">
                                        <i className="bi bi-geo-alt me-1"></i>
                                        {restaurante?.direccion}, {restaurante?.ciudad}
                                    </small>
                                </div>
                            </div>

                            <input type="hidden" name="restaurante_id" value={restaurante?.id} />

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="cliente_nombre" className="form-label">
                                        Nombre del cliente <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="cliente_nombre"
                                        name="cliente_nombre"
                                        required
                                        placeholder="Tu nombre completo"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="fecha" className="form-label">
                                        Fecha <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fecha"
                                        name="fecha"
                                        min={today}
                                        required
                                        value={fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Disponibilidad y selección de mesas */}
                            {fecha && (
                                <div className="mt-4">
                                    <label className="form-label">
                                        Selecciona las mesas <span className="text-danger">*</span>
                                        {mesasSeleccionadas.length > 0 && (
                                            <span className="badge bg-primary ms-2">
                                                {mesasSeleccionadas.length} mesa(s) seleccionada(s)
                                            </span>
                                        )}
                                    </label>

                                    {loadingDisp ? (
                                        <div className="text-center py-3">
                                            <div className="spinner-border spinner-border-sm text-primary"></div>
                                            <span className="ms-2">Verificando disponibilidad...</span>
                                        </div>
                                    ) : disponibilidad ? (
                                        <>
                                            {/* Información de disponibilidad */}
                                            <div className="mb-3">
                                                <small className="text-muted">
                                                    Mesas disponibles: {disponibilidad.mesas_disponibles.length}/15 |
                                                    Mesas reservadas hoy: {disponibilidad.mesas_totales_dia}/20
                                                </small>
                                                {disponibilidad.limite_dia_alcanzado && (
                                                    <div className="alert alert-warning mt-2">
                                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                                        Se alcanzó el límite de reservas para este día.
                                                    </div>
                                                )}
                                            </div>

                                            {/* Grid de mesas con checkbox */}
                                            <div className="d-flex flex-wrap gap-2">
                                                {Array.from({ length: 15 }, (_, i) => i + 1).map((mesa) => {
                                                    const disponible = disponibilidad.mesas_disponibles.includes(mesa);
                                                    const seleccionada = mesasSeleccionadas.includes(mesa);
                                                    const disabled = !disponible || disponibilidad.limite_dia_alcanzado;

                                                    return (
                                                        <button
                                                            key={mesa}
                                                            type="button"
                                                            className={`btn ${seleccionada
                                                                    ? "btn-success"
                                                                    : disabled
                                                                        ? "btn-secondary"
                                                                        : "btn-outline-primary"
                                                                }`}
                                                            onClick={() => !disabled && toggleMesa(mesa)}
                                                            disabled={disabled}
                                                            style={{
                                                                width: "60px",
                                                                opacity: disabled ? 0.5 : 1,
                                                                cursor: disabled ? "not-allowed" : "pointer"
                                                            }}
                                                        >
                                                            <i className={`bi ${seleccionada ? "bi-check-lg" : "bi-table"} me-1`}></i>
                                                            {mesa}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-3 d-flex gap-3">
                                                <small className="text-success">
                                                    <i className="bi bi-check-circle-fill me-1"></i>
                                                    Seleccionada
                                                </small>
                                                <small className="text-primary">
                                                    <i className="bi bi-circle me-1"></i>
                                                    Disponible
                                                </small>
                                                <small className="text-secondary">
                                                    <i className="bi bi-x-circle-fill me-1"></i>
                                                    Ocupada
                                                </small>
                                            </div>

                                            {/* Resumen de mesas seleccionadas */}
                                            {mesasSeleccionadas.length > 0 && (
                                                <div className="alert alert-success mt-3">
                                                    <strong>Mesas seleccionadas:</strong> {mesasSeleccionadas.join(', ')}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-muted">Selecciona una fecha para ver disponibilidad</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading || !fecha || mesasSeleccionadas.length === 0 || disponibilidad?.limite_dia_alcanzado}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Reservando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg me-1"></i>
                                        Reservar {mesasSeleccionadas.length > 0 ? `${mesasSeleccionadas.length} Mesa(s)` : ''}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReservaForm;
