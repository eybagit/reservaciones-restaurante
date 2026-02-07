import React from "react";
import { Link } from "react-router-dom";

/**
 * RestauranteCard - Componente tonto para mostrar un restaurante
 * Recibe datos via props, no tiene lógica de negocio
 */
const RestauranteCard = ({ restaurante, onEdit, onDelete, onReservar }) => {
    return (
        <div className="card h-100 shadow-sm restaurante-card">
            <img
                src={restaurante.foto_url || "https://picsum.photos/400/300?grayscale"}
                className="card-img-top"
                alt={restaurante.nombre}
                style={{ height: "180px", objectFit: "cover" }}
            />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{restaurante.nombre}</h5>
                <p className="card-text text-muted small mb-2">
                    <i className="bi bi-geo-alt me-1"></i>
                    {restaurante.ciudad}
                </p>
                <p className="card-text flex-grow-1">
                    {restaurante.descripcion?.substring(0, 100)}
                    {restaurante.descripcion?.length > 100 ? "..." : ""}
                </p>
                <p className="card-text small text-muted">
                    <i className="bi bi-pin-map me-1"></i>
                    {restaurante.direccion}
                </p>

                <div className="d-flex gap-2 mt-auto">
                    <button
                        className="btn btn-primary btn-sm flex-grow-1"
                        onClick={() => onReservar(restaurante)}
                    >
                        <i className="bi bi-calendar-plus me-1"></i>
                        Reservar
                    </button>
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => onEdit(restaurante)}
                        title="Editar"
                    >
                        <i className="bi bi-pencil"></i>
                    </button>
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onDelete(restaurante.id)}
                        title="Eliminar"
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestauranteCard;
