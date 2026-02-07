import React from "react";

/**
 * Footer - Componente de pie de página
 */
const Footer = () => {
    return (
        <footer className="bg-dark text-white py-4 mt-auto">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6 text-center text-md-start">
                        <p className="mb-0">
                            <i className="bi bi-shop me-2"></i>
                            <strong>ReservaApp</strong> - Sistema de Reservas de Restaurantes
                        </p>
                        <small className="text-muted">
                            Prueba Técnica - Febrero 2026
                        </small>
                    </div>
                    <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
                        <small className="text-muted">
                            <i className="bi bi-code-slash me-1"></i>
                            Flask + React
                        </small>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
