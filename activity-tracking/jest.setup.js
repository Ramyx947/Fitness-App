const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Set timezone to UTC for consistent date handling in all tests
process.env.TZ = 'UTC';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '6.0.14', // Use a stable MongoDB version
      skipMD5: true,
    },
    instance: {
      dbName: 'jest',
    },
  });

  const uri = mongoServer.getUri();
  global.__MONGO_URI__ = uri;


  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});