import React from "react";
import RestauranteCard from "./RestauranteCard";

/**
 * RestauranteList - Componente tonto para listar restaurantes
 * Recibe datos y funciones via props
 */
const RestauranteList = ({
    restaurantes,
    loading,
    onEdit,
    onDelete,
    onReservar
}) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2 text-muted">Cargando restaurantes...</p>
            </div>
        );
    }

    if (!restaurantes || restaurantes.length === 0) {
        return (
            <div className="alert alert-info text-center">
                <i className="bi bi-info-circle me-2"></i>
                No se encontraron restaurantes. ¡Agrega uno nuevo!
            </div>
        );
    }

    return (
        <div className="row g-4">
            {restaurantes.map((restaurante) => (
                <div key={restaurante.id} className="col-12 col-md-6 col-lg-4">
                    <RestauranteCard
                        restaurante={restaurante}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onReservar={onReservar}
                    />
                </div>
            ))}
        </div>
    );
};

export default RestauranteList;
