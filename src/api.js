import axios from 'axios';

/**
 * Client API centralisé utilisant Axios.
 * Configure la base URL et les en-têtes par défaut pour toutes les requêtes.
 */
export const BASE_URL = 'https://residence.groupealpha1.com';

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        'Accept': 'application/json'
    }
});

/**
 * Intercepteur de requête : 
 * Injecte automatiquement le token Bearer stocké dans le localStorage
 * s'il existe, avant chaque appel à l'API.
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
