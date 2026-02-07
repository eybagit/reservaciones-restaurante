import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { reservaService } from "../services/reservaService";
import ReservaList from "../components/ReservaList";

/**
 * ReservasPage - Contenedor inteligente
 * Gestiona estado y lógica de negocio para reservas
 */
const ReservasPage = () => {
    const { store, dispatch } = useGlobalReducer();

    // Cargar reservas al montar
    useEffect(() => {
        reservaService.getAll(dispatch);
    }, []);

    // Handler para cancelar reserva
    const handleDelete = async (id) => {
        try {
            await reservaService.delete(dispatch, id);
        } catch (error) {
            alert("Error al cancelar: " + error.message);
        }
    };

    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                    <h1 className="mb-1">
                        <i className="bi bi-calendar-check me-2"></i>
                        Reservas
                    </h1>
                    <p className="text-muted mb-0">
                        Gestiona todas las reservas de mesas
                    </p>
                </div>
                <Link to="/" className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i>
                    Nueva Reserva
                </Link>
            </div>

            {/* Estadísticas rápidas */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card bg-primary text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-white-50">Total Reservas</h6>
                                    <h2 className="mb-0">{store.entities.reservas.length}</h2>
                                </div>
                                <i className="bi bi-calendar-check fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card bg-success text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-white-50">Hoy</h6>
                                    <h2 className="mb-0">
                                        {store.entities.reservas.filter(r =>
                                            r.fecha === new Date().toISOString().split("T")[0]
                                        ).length}
                                    </h2>
                                </div>
                                <i className="bi bi-calendar-day fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card bg-info text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-white-50">Próximas</h6>
                                    <h2 className="mb-0">
                                        {store.entities.reservas.filter(r =>
                                            r.fecha > new Date().toISOString().split("T")[0]
                                        ).length}
                                    </h2>
                                </div>
                                <i className="bi bi-calendar-plus fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {store.api.error && (
                <div className="alert alert-danger alert-dismissible fade show">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {store.api.error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => dispatch({ type: "CLEAR_ERROR" })}
                    ></button>
                </div>
            )}

            {/* Lista de reservas */}
            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <h5 className="mb-0">
                        <i className="bi bi-list-ul me-2"></i>
                        Todas las Reservas
                    </h5>
                </div>
                <div className="card-body p-0">
                    <ReservaList
                        reservas={store.entities.reservas}
                        loading={store.api.loading}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReservasPage;
