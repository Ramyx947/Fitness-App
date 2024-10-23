const request = require('supertest');
const mongoose = require('mongoose');
const Exercise = require('../../models/exercise.model');
const app = require('../../server');

let exerciseId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  // Create a new exercise for testing
  const exercise = new Exercise({
    username: 'UserOne',
    exerciseType: 'Swimming',
    description: 'Morning swim',
    duration: 30,
    date: new Date(),
  });
  // Store the valid ObjectId
  const savedExercise = await exercise.save();
  exerciseId = savedExercise._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Exercise API Tests', () => {
  // POST new exercise
  it('should create a new exercise', async () => {
    const newExercise = {
      username: 'UserOne',
      exerciseType: 'Swimming',
      description: 'Morning swim',
      duration: 30,
      date: new Date(),
    };

    const response = await request(app)
      .post('/exercises/add')
      .send(newExercise);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Exercise added!');
  });

  // GET /exercises/
  it('should retrieve all exercises', async () => {
    const response = await request(app).get('/exercises');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // GET /exercises/:id
  it('should retrieve an exercise by id', async () => {
    const response = await request(app).get(`/exercises/${exerciseId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe('UserOne');
  });

// PUT /exercises/update/:id**
it('should update an existing exercise', async () => {
    const updatedExercise = {
      username: 'UserTwo',
      exerciseType: 'Running',
      description: 'Afternoon run',
      duration: 45,
      date: new Date(),
    };

    const response = await request(app)
      .put(`/exercises/update/${exerciseId}`)
      .send(updatedExercise);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Exercise updated!');
  });


  // DELETE /exercises/:id
  it('should delete an exercise by id', async () => {
    const response = await request(app).delete(`/exercises/${exerciseId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Exercise deleted.');
  });
});