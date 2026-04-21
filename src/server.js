require('dotenv').config();

const app = require('./app');
const { connectPostgres } = require('./config/db.postgres');
const { connectMongoDB } = require('./config/db.mongo');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Connect to both databases
        await connectPostgres();
        await connectMongoDB();

        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
            console.log(`📖 Swagger docs: http://localhost:${PORT}/api-docs\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
