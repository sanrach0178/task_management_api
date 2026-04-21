const request = require('supertest');
const app = require('../src/app');

describe('Auth API Endpoints', () => {

    // Dynamic user generator to avoid DB collisions
    const getTestUser = () => ({
        email: `test-${Date.now()}-${Math.random()}@example.com`,
        password: 'Password123'
    });

    it('should register a new user', async () => {
        const testUser = getTestUser();
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBeTruthy();
        expect(res.body.message).toEqual('User registered successfully.');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.email).toEqual(testUser.email);
    });

    it('should not register user with duplicate email', async () => {
        const testUser = getTestUser();
        await request(app).post('/api/auth/register').send(testUser);

        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toEqual(409);
        expect(res.body.success).toBeFalsy();
    });

    it('should login an existing user', async () => {
        const testUser = getTestUser();
        await request(app).post('/api/auth/register').send(testUser);

        const res = await request(app)
            .post('/api/auth/login')
            .send(testUser);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data).toHaveProperty('token');
    });

    it('should get profile with valid token', async () => {
        const testUser = getTestUser();
        await request(app).post('/api/auth/register').send(testUser);
        const loginRes = await request(app).post('/api/auth/login').send(testUser);
        const validToken = loginRes.body.data.token;

        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${validToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data.email).toEqual(testUser.email);
    });
});
