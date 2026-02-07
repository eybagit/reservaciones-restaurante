/**
 * Store Global - Sistema de Reservas de Restaurantes
 * Arquitectura: useReducer + Context API
 */

// Estado inicial del store
export const initialStore = () => {
  return {
    // === ENTIDADES DEL NEGOCIO ===
    entities: {
      restaurantes: [],
      reservas: [],
      ciudades: []
    },
    
    // === ESTADOS DE INTERFAZ ===
    ui: {
      filtros: {
        letra: '',
        ciudad: ''
      },
      showRestauranteForm: false,
      showReservaForm: false,
      editingRestaurante: null,
      selectedRestaurante: null
    },
    
    // === ESTADOS DE API ===
    api: {
      loading: false,
      error: null
    }
  };
};

// Reducer global
export default function storeReducer(store, action = {}) {
  switch (action.type) {
    // === RESTAURANTES ===
    case 'SET_RESTAURANTES':
      return {
        ...store,
        entities: { ...store.entities, restaurantes: action.payload }
      };
    
    case 'ADD_RESTAURANTE':
      return {
        ...store,
        entities: {
          ...store.entities,
          restaurantes: [...store.entities.restaurantes, action.payload]
        }
      };
    
    case 'UPDATE_RESTAURANTE':
      return {
        ...store,
        entities: {
          ...store.entities,
          restaurantes: store.entities.restaurantes.map(r =>
            r.id === action.payload.id ? action.payload : r
          )
        }
      };
    
    case 'DELETE_RESTAURANTE':
      return {
        ...store,
        entities: {
          ...store.entities,
          restaurantes: store.entities.restaurantes.filter(r => r.id !== action.payload)
        }
      };
    
    // === RESERVAS ===
    case 'SET_RESERVAS':
      return {
        ...store,
        entities: { ...store.entities, reservas: action.payload }
      };
    
    case 'ADD_RESERVA':
      return {
        ...store,
        entities: {
          ...store.entities,
          reservas: [...store.entities.reservas, action.payload]
        }
      };
    
    case 'DELETE_RESERVA':
      return {
        ...store,
        entities: {
          ...store.entities,
          reservas: store.entities.reservas.filter(r => r.id !== action.payload)
        }
      };
    
    // === CIUDADES ===
    case 'SET_CIUDADES':
      return {
        ...store,
        entities: { ...store.entities, ciudades: action.payload }
      };
    
    // === FILTROS UI ===
    case 'SET_FILTRO_LETRA':
      return {
        ...store,
        ui: {
          ...store.ui,
          filtros: { ...store.ui.filtros, letra: action.payload }
        }
      };
    
    case 'SET_FILTRO_CIUDAD':
      return {
        ...store,
        ui: {
          ...store.ui,
          filtros: { ...store.ui.filtros, ciudad: action.payload }
        }
      };
    
    case 'CLEAR_FILTROS':
      return {
        ...store,
        ui: {
          ...store.ui,
          filtros: { letra: '', ciudad: '' }
        }
      };
    
    // === UI MODALS ===
    case 'TOGGLE_RESTAURANTE_FORM':
      return {
        ...store,
        ui: {
          ...store.ui,
          showRestauranteForm: !store.ui.showRestauranteForm,
          editingRestaurante: action.payload || null
        }
      };
    
    case 'TOGGLE_RESERVA_FORM':
      return {
        ...store,
        ui: {
          ...store.ui,
          showReservaForm: !store.ui.showReservaForm,
          selectedRestaurante: action.payload || null
        }
      };
    
    case 'SET_SELECTED_RESTAURANTE':
      return {
        ...store,
        ui: { ...store.ui, selectedRestaurante: action.payload }
      };
    
    // === API STATES ===
    case 'API_START':
      return {
        ...store,
        api: { ...store.api, loading: true, error: null }
      };
    
    case 'API_SUCCESS':
      return {
        ...store,
        api: { ...store.api, loading: false }
      };
    
    case 'API_ERROR':
      return {
        ...store,
        api: { ...store.api, loading: false, error: action.payload }
      };
    
    case 'CLEAR_ERROR':
      return {
        ...store,
        api: { ...store.api, error: null }
      };
    
    default:
      console.warn(`Action type "${action.type}" not recognized`);
      return store;
  }
}
