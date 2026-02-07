import React from "react";

/**
 * RestauranteForm - Formulario para crear/editar restaurante
 * Usa FormData + defaultValue según arquitectura
 */
const RestauranteForm = ({ restaurante, onSubmit, onCancel, loading }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onSubmit(formData);
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-shop me-2"></i>
                            {restaurante ? "Editar Restaurante" : "Nuevo Restaurante"}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onCancel}
                            disabled={loading}
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">
                                    Nombre <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombre"
                                    name="nombre"
                                    defaultValue={restaurante?.nombre || ""}
                                    required
                                    placeholder="Nombre del restaurante"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="descripcion" className="form-label">
                                    Descripción
                                </label>
                                <textarea
                                    className="form-control"
                                    id="descripcion"
                                    name="descripcion"
                                    defaultValue={restaurante?.descripcion || ""}
                                    rows="3"
                                    placeholder="Describe el restaurante..."
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="direccion" className="form-label">
                                    Dirección <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="direccion"
                                    name="direccion"
                                    defaultValue={restaurante?.direccion || ""}
                                    required
                                    placeholder="Calle, número, barrio"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="ciudad" className="form-label">
                                    Ciudad <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ciudad"
                                    name="ciudad"
                                    defaultValue={restaurante?.ciudad || ""}
                                    required
                                    placeholder="Ciudad"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="foto_url" className="form-label">
                                    URL de la foto
                                </label>
                                <input
                                    type="url"
                                    className="form-control"
                                    id="foto_url"
                                    name="foto_url"
                                    defaultValue={restaurante?.foto_url || ""}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                            </div>
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
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg me-1"></i>
                                        {restaurante ? "Actualizar" : "Crear"}
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

export default RestauranteForm;
