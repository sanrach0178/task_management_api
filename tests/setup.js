require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { sequelize } = require('../src/config/db.postgres');

let mongoServer;

beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
    await sequelize.close();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }

    const models = sequelize.models;
    for (const key in models) {
        await models[key].destroy({ where: {}, truncate: true, cascade: true });
    }
});
