// src/tests/integration/guest.routes.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

describe('Guest Routes — Integration Tests', () => {

    const guestData = {
        name: 'Test Guest',
        email: 'test@serena.rw',
        password: 'pass1234',
        phone: '+250788111222',
    };

    test('POST /api/guests/register — should register successfully', async () => {
        const res = await request(app)
            .post('/api/guests/register')
            .send(guestData);
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.token).toBeDefined();
    });

    test('POST /api/guests/register — should fail duplicate email', async () => {
        await request(app).post('/api/guests/register').send(guestData);
        const res = await request(app)
            .post('/api/guests/register')
            .send(guestData);
        expect(res.statusCode).toBe(400);
    });

    test('POST /api/guests/login — should login successfully', async () => {
        await request(app).post('/api/guests/register').send(guestData);
        const res = await request(app)
            .post('/api/guests/login')
            .send({ email: guestData.email, password: guestData.password });
        expect(res.statusCode).toBe(200);
        expect(res.body.data.token).toBeDefined();
    });

    test('POST /api/guests/login — should fail wrong password', async () => {
        await request(app).post('/api/guests/register').send(guestData);
        const res = await request(app)
            .post('/api/guests/login')
            .send({ email: guestData.email, password: 'wrongpass' });
        expect(res.statusCode).toBe(401);
    });

});