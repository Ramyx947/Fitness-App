const config = {
    development: {
        allowedOrigins: [
            'http://localhost:3000', // Frontend
            'http://localhost',
            'http://localhost:5300', // Activity Tracking Service
            'http://localhost:5050', // Analytics Service
            'http://localhost:5051', // Recipes Service
            'http://localhost:8080', // Auth Service
            'http://localhost:50'    // CI pipeline port
        ],
    },
    production: {
        allowedOrigins: [
            'https://fitapp.co.uk', // Main Production Domain 
        ],
    },
    test: {
        "allowedOrigins": ["*"] // or ["*"] to allow all origins
    }
};

module.exports = config;
