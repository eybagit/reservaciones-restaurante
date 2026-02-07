/**
 * Servicio API para Restaurantes
 * Centraliza todas las llamadas API de restaurantes
 */

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:3001';

export const restauranteService = {
  /**
   * Obtener todos los restaurantes con filtros opcionales
   */
  getAll: async (dispatch, filtros = {}) => {
    dispatch({ type: 'API_START' });
    try {
      let url = `${API_URL}/api/restaurantes`;
      const params = new URLSearchParams();
      
      if (filtros.letra) params.append('letra', filtros.letra);
      if (filtros.ciudad) params.append('ciudad', filtros.ciudad);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener restaurantes');
      
      const data = await response.json();
      dispatch({ type: 'SET_RESTAURANTES', payload: data });
      dispatch({ type: 'API_SUCCESS' });
      return data;
    } catch (error) {
      dispatch({ type: 'API_ERROR', payload: error.message });
      throw error;
    }
  },

  /**
   * Obtener un restaurante por ID
   */
  getById: async (dispatch, id) => {
    dispatch({ type: 'API_START' });
    try {
      const response = await fetch(`${API_URL}/api/restaurantes/${id}`);
      if (!response.ok) throw new Error('Restaurante no encontrado');
      
      const data = await response.json();
      dispatch({ type: 'API_SUCCESS' });
      return data;
    } catch (error) {
      dispatch({ type: 'API_ERROR', payload: error.message });
      throw error;
    }
  },

  /**
   * Crear nuevo restaurante
   */
  create: async (dispatch, formData) => {
    dispatch({ type: 'API_START' });
    try {
      // Convertir FormData a JSON
      const data = {};
      formData.forEach((value, key) => data[key] = value);
      
      const response = await fetch(`${API_URL}/api/restaurantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear restaurante');
      }
      
      const newRestaurante = await response.json();
      dispatch({ type: 'ADD_RESTAURANTE', payload: newRestaurante });
      dispatch({ type: 'API_SUCCESS' });
      return newRestaurante;
    } catch (error) {
      dispatch({ type: 'API_ERROR', payload: error.message });
      throw error;
    }
  },

  /**
   * Actualizar restaurante existente
   */
  update: async (dispatch, id, formData) => {
    dispatch({ type: 'API_START' });
    try {
      const data = {};
      formData.forEach((value, key) => data[key] = value);
      
      const response = await fetch(`${API_URL}/api/restaurantes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar restaurante');
      }
      
      const updated = await response.json();
      dispatch({ type: 'UPDATE_RESTAURANTE', payload: updated });
      dispatch({ type: 'API_SUCCESS' });
      return updated;
    } catch (error) {
      dispatch({ type: 'API_ERROR', payload: error.message });
      throw error;
    }
  },

  /**
   * Eliminar restaurante
   */
  delete: async (dispatch, id) => {
    dispatch({ type: 'API_START' });
    try {
      const response = await fetch(`${API_URL}/api/restaurantes/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Error al eliminar restaurante');
      
      dispatch({ type: 'DELETE_RESTAURANTE', payload: id });
      dispatch({ type: 'API_SUCCESS' });
    } catch (error) {
      dispatch({ type: 'API_ERROR', payload: error.message });
      throw error;
    }
  },

  /**
   * Obtener lista de ciudades para filtros
   */
  getCiudades: async (dispatch) => {
    try {
      const response = await fetch(`${API_URL}/api/restaurantes/ciudades`);
      if (!response.ok) throw new Error('Error al obtener ciudades');
      
      const data = await response.json();
      dispatch({ type: 'SET_CIUDADES', payload: data });
      return data;
    } catch (error) {
      console.error('Error obteniendo ciudades:', error);
      return [];
    }
  }
};
