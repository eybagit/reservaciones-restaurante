import React from "react";

/**
 * RestauranteFiltros - Componente para filtrar restaurantes
 * Por letra inicial y ciudad
 */
const RestauranteFiltros = ({
    ciudades,
    filtroLetra,
    filtroCiudad,
    onLetraChange,
    onCiudadChange,
    onClear
}) => {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-body">
                <h6 className="card-title mb-3">
                    <i className="bi bi-funnel me-2"></i>
                    Filtrar restaurantes
                </h6>

                <div className="row g-3">
                    {/* Filtro por ciudad */}
                    <div className="col-12 col-md-4">
                        <label htmlFor="filtroCiudad" className="form-label small">
                            Por ciudad
                        </label>
                        <select
                            id="filtroCiudad"
                            className="form-select"
                            value={filtroCiudad}
                            onChange={(e) => onCiudadChange(e.target.value)}
                        >
                            <option value="">Todas las ciudades</option>
                            {ciudades.map((ciudad) => (
                                <option key={ciudad} value={ciudad}>
                                    {ciudad}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por letra */}
                    <div className="col-12 col-md-6">
                        <label className="form-label small">Por letra inicial</label>
                        <div className="d-flex flex-wrap gap-1">
                            {letras.map((letra) => (
                                <button
                                    key={letra}
                                    type="button"
                                    className={`btn btn-sm ${filtroLetra === letra
                                            ? "btn-primary"
                                            : "btn-outline-secondary"
                                        }`}
                                    onClick={() => onLetraChange(filtroLetra === letra ? "" : letra)}
                                    style={{ width: "32px", padding: "0.25rem" }}
                                >
                                    {letra}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Botón limpiar */}
                    <div className="col-12 col-md-2 d-flex align-items-end">
                        <button
                            type="button"
                            className="btn btn-outline-secondary w-100"
                            onClick={onClear}
                        >
                            <i className="bi bi-x-lg me-1"></i>
                            Limpiar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestauranteFiltros;
