// API Configuration
const API_CONFIG = {
    // Development environment
    development: {
        BASE_URL: 'http://localhost:8080/api'
    },
    // Production environment
    production: {
        BASE_URL: 'http://194.195.116.252:8080/api'
    }
};

// Get current environment
const getEnvironment = () => {
    return import.meta.env.MODE || 'development';
};

// Get API base URL for current environment
export const API_BASE_URL = API_CONFIG[getEnvironment()].BASE_URL;

export default API_CONFIG;
