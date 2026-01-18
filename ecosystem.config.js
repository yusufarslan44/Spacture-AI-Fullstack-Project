module.exports = {
    apps: [
        {
            name: 'spacture-backend',
            cwd: './backend',
            script: 'src/server.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 5005,
                MONGODB_URI: 'mongodb://localhost:27017/spacture-prod' // Change as needed
            }
        },
        {
            name: 'spacture-frontend',
            cwd: './frontend',
            script: 'serve',
            env: {
                PM2_SERVE_PATH: './dist',
                PM2_SERVE_PORT: 3005,
                PM2_SERVE_SPA: 'true',
                PM2_SERVE_HOMEPAGE: '/index.html'
            }
        }
    ]
};
