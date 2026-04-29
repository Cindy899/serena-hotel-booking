// src/tests/unit/room.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Room = require('../../models/Room');

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
    await Room.deleteMany({});
});

describe('Room Model — Unit Tests', () => {

    test('should create a valid room successfully', async () => {
        const room = await Room.create({
            roomNumber: '101',
            roomType: 'Deluxe',
            pricePerNight: 150,
            capacity: 2,
        });
        expect(room._id).toBeDefined();
        expect(room.roomNumber).toBe('101');
        expect(room.isAvailable).toBe(true);
    });

    test('should fail if roomNumber is missing', async () => {
        const room = new Room({
            roomType: 'Standard',
            pricePerNight: 100,
            capacity: 2,
        });
        await expect(room.save()).rejects.toThrow();
    });

    test('should fail if roomType is invalid', async () => {
        const room = new Room({
            roomNumber: '102',
            roomType: 'Penthouse',
            pricePerNight: 200,
            capacity: 3,
        });
        await expect(room.save()).rejects.toThrow();
    });

    test('should default isAvailable to true', async () => {
        const room = await Room.create({
            roomNumber: '103',
            roomType: 'Suite',
            pricePerNight: 300,
            capacity: 4,
        });
        expect(room.isAvailable).toBe(true);
    });

});