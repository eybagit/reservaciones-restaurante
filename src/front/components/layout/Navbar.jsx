import React from "react";
import { Link, NavLink } from "react-router-dom";

/**
 * Navbar - Componente de navegación principal
 */
const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <i className="bi bi-shop me-2"></i>
                    <span>ReservaApp</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                <i className="bi bi-shop me-1"></i>
                                Restaurantes
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/reservas"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                <i className="bi bi-calendar-check me-1"></i>
                                Reservas
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
