import React from "react";

/**
 * ReservaList - Tabla de reservas
 * Componente tonto para mostrar lista de reservas con múltiples mesas
 */
const ReservaList = ({ reservas, loading, onDelete }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2 text-muted">Cargando reservas...</p>
            </div>
        );
    }

    if (!reservas || reservas.length === 0) {
        return (
            <div className="alert alert-info text-center">
                <i className="bi bi-calendar-x me-2"></i>
                No hay reservas registradas.
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Restaurante</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Mesas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map((reserva) => (
                        <tr key={reserva.id}>
                            <td>
                                <span className="badge bg-secondary">#{reserva.id}</span>
                            </td>
                            <td>
                                <strong>{reserva.restaurante_nombre}</strong>
                            </td>
                            <td>{reserva.cliente_nombre}</td>
                            <td>
                                <i className="bi bi-calendar me-1"></i>
                                {new Date(reserva.fecha + "T00:00:00").toLocaleDateString("es-CO", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </td>
                            <td>
                                <div className="d-flex flex-wrap gap-1">
                                    {(reserva.mesas || []).map((mesa) => (
                                        <span key={mesa} className="badge bg-primary">
                                            <i className="bi bi-table me-1"></i>
                                            {mesa}
                                        </span>
                                    ))}
                                </div>
                                <small className="text-muted">
                                    {(reserva.mesas || []).length} mesa(s)
                                </small>
                            </td>
                            <td>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => {
                                        if (confirm("¿Cancelar esta reserva?")) {
                                            onDelete(reserva.id);
                                        }
                                    }}
                                    title="Cancelar reserva"
                                >
                                    <i className="bi bi-x-circle me-1"></i>
                                    Cancelar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservaList;
