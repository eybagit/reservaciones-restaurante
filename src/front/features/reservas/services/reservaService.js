/**
 * Servicio API para Reservas
 * Centraliza todas las llamadas API de reservas
 */

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:3001';

export const reservaService = {
  /**
   * Obtener todas las reservas
   */
  getAll: async (dispatch) => {
    dispatch({ type: 'API_START' });
    try {
      const response = await fetch(`${API_URL}/api/reservas`);
      if (!response.ok) throw new Error('Error al obtener reservas');
      
      const data = await response.json();
      dispatch({ type: 'SET_RESERVAS', payload: data });
      dispatch({ type: 'API_SUCCESS' });
      return data;
    } catch (error) {
      dispatch({ type: 'API_ERROR', payload: error.message });
      throw error;
    }
  },

  /**
   * Crear nueva reserva con múltiples mesas
   */
  create: async (dispatch, formData) => {
    dispatch({ type: 'API_START' });
    try {
      const data = {};
      formData.forEach((value, key) => data[key] = value);
      
      // Convertir restaurante_id a número
      if (data.restaurante_id) data.restaurante_id = parseInt(data.restaurante_id);
      
      // Convertir mesas a array si viene como string
      if (data.mesas && typeof data.mesas === 'string') {
        data.mesas = data.mesas.split(',').map(m => parseInt(m));
      }
      
      const response = await fetch(`${API_URL}/api/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear reserva');
      }
      
      const newReserva = await response.json();
      dispatch({ type: 'ADD_RESERVA', payload: newReserva });
      dispatch({ type: 'API_SUCCESS' });
      return newReserva;
    } catch (error) {
      dispatch({ type: 'API_ERROR', payload: error.message });
      throw error;
    }
  },

  /**
   * Cancelar reserva
   */
  delete: async (dispatch, id) => {
    dispatch({ type: 'API_START' });
    try {
      const response = await fetch(`${API_URL}/api/reservas/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Error al cancelar reserva');
      
      dispatch({ type: 'DELETE_RESERVA', payload: id });
      dispatch({ type: 'API_SUCCESS' });
    } catch (error) {
      dispatch({ type: 'API_ERROR', payload: error.message });
      throw error;
    }
  },

  /**
   * Obtener disponibilidad de mesas
   */
  getDisponibilidad: async (restauranteId, fecha) => {
    try {
      const response = await fetch(
        `${API_URL}/api/reservas/disponibilidad/${restauranteId}/${fecha}`
      );
      
      if (!response.ok) throw new Error('Error al verificar disponibilidad');
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo disponibilidad:', error);
      throw error;
    }
  }
};
