import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { restauranteService } from "../services/restauranteService";
import RestauranteList from "../components/RestauranteList";
import RestauranteFiltros from "../components/RestauranteFiltros";
import RestauranteForm from "../components/RestauranteForm";
import ReservaForm from "../../reservas/components/ReservaForm";
import { reservaService } from "../../reservas/services/reservaService";

/**
 * RestaurantesPage - Contenedor inteligente
 * Gestiona estado y lógica de negocio
 */
const RestaurantesPage = () => {
    const { store, dispatch } = useGlobalReducer();

    // Cargar restaurantes y ciudades al montar
    useEffect(() => {
        restauranteService.getAll(dispatch, store.ui.filtros);
        restauranteService.getCiudades(dispatch);
    }, []);

    // Recargar cuando cambian filtros
    useEffect(() => {
        restauranteService.getAll(dispatch, store.ui.filtros);
    }, [store.ui.filtros.letra, store.ui.filtros.ciudad]);

    // Handlers
    const handleEdit = (restaurante) => {
        dispatch({ type: "TOGGLE_RESTAURANTE_FORM", payload: restaurante });
    };

    const handleDelete = async (id) => {
        if (confirm("¿Estás seguro de eliminar este restaurante?")) {
            try {
                await restauranteService.delete(dispatch, id);
            } catch (error) {
                alert("Error al eliminar: " + error.message);
            }
        }
    };

    const handleReservar = (restaurante) => {
        dispatch({ type: "TOGGLE_RESERVA_FORM", payload: restaurante });
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (store.ui.editingRestaurante) {
                await restauranteService.update(dispatch, store.ui.editingRestaurante.id, formData);
            } else {
                await restauranteService.create(dispatch, formData);
            }
            dispatch({ type: "TOGGLE_RESTAURANTE_FORM" });
            restauranteService.getCiudades(dispatch); // Actualizar ciudades
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    const handleReservaSubmit = async (formData) => {
        try {
            await reservaService.create(dispatch, formData);
            dispatch({ type: "TOGGLE_RESERVA_FORM" });
            alert("¡Reserva creada exitosamente!");
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                    <h1 className="mb-1">
                        <i className="bi bi-shop me-2"></i>
                        Restaurantes
                    </h1>
                    <p className="text-muted mb-0">
                        Administra tus restaurantes y realiza reservas
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => dispatch({ type: "TOGGLE_RESTAURANTE_FORM" })}
                >
                    <i className="bi bi-plus-lg me-1"></i>
                    Nuevo Restaurante
                </button>
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

            {/* Filtros */}
            <RestauranteFiltros
                ciudades={store.entities.ciudades}
                filtroLetra={store.ui.filtros.letra}
                filtroCiudad={store.ui.filtros.ciudad}
                onLetraChange={(letra) => dispatch({ type: "SET_FILTRO_LETRA", payload: letra })}
                onCiudadChange={(ciudad) => dispatch({ type: "SET_FILTRO_CIUDAD", payload: ciudad })}
                onClear={() => dispatch({ type: "CLEAR_FILTROS" })}
            />

            {/* Lista de restaurantes */}
            <RestauranteList
                restaurantes={store.entities.restaurantes}
                loading={store.api.loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReservar={handleReservar}
            />

            {/* Modal: Formulario Restaurante */}
            {store.ui.showRestauranteForm && (
                <RestauranteForm
                    restaurante={store.ui.editingRestaurante}
                    onSubmit={handleFormSubmit}
                    onCancel={() => dispatch({ type: "TOGGLE_RESTAURANTE_FORM" })}
                    loading={store.api.loading}
                />
            )}

            {/* Modal: Formulario Reserva */}
            {store.ui.showReservaForm && (
                <ReservaForm
                    restaurante={store.ui.selectedRestaurante}
                    onSubmit={handleReservaSubmit}
                    onCancel={() => dispatch({ type: "TOGGLE_RESERVA_FORM" })}
                    loading={store.api.loading}
                />
            )}
        </div>
    );
};

export default RestaurantesPage;
