// src/tests/unit/guest.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Guest = require('../../models/Guest');

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
    await Guest.deleteMany({});
});

describe('Guest Model — Unit Tests', () => {

    test('should register guest and hash password', async () => {
        const guest = await Guest.create({
            name: 'Jean Pierre',
            email: 'jp@serena.rw',
            password: 'pass1234',
            phone: '+250788000001',
        });
        expect(guest._id).toBeDefined();
        expect(guest.password).not.toBe('pass1234');
    });

    test('should match correct password', async () => {
        const guest = await Guest.create({
            name: 'Alice',
            email: 'alice@serena.rw',
            password: 'mypassword',
            phone: '+250788000002',
        });
        const match = await guest.matchPassword('mypassword');
        expect(match).toBe(true);
    });

    test('should reject wrong password', async () => {
        const guest = await Guest.create({
            name: 'Bob',
            email: 'bob@serena.rw',
            password: 'correctpass',
            phone: '+250788000003',
        });
        const match = await guest.matchPassword('wrongpass');
        expect(match).toBe(false);
    });

    test('should fail if email is missing', async () => {
        const guest = new Guest({
            name: 'No Email',
            password: 'pass123',
            phone: '+250788000004',
        });
        await expect(guest.save()).rejects.toThrow();
    });

});