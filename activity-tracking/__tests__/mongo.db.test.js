const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to in-memory MongoDB:', uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  console.log('Disconnected from in-memory MongoDB');
});

test('simple database connection', async () => {
  const UserSchema = new mongoose.Schema({ name: String });
  const User = mongoose.model('User', UserSchema);
  const user = new User({ name: 'Test User' });
  await user.save();
  const foundUser = await User.findOne({ name: 'Test User' });
  expect(foundUser.name).toBe('Test User');
});
