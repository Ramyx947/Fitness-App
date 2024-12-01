const request = require('supertest');
const mongoose = require('mongoose');
const Exercise = require('../../models/exercise.model');
const app = require('../../server');
const { validateExercise } = require('../helpers/exerciseHelpers');

let exerciseId;

// Establish DB connection before running the tests
beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

// Close DB connection after tests run
afterAll(async () => {
  await mongoose.connection.close();
});

// Set up test data before each test
beforeEach(async () => {
  // Create a new exercise for testing
  const exercise = new Exercise({
    username: 'UserOne',
    exerciseType: 'Swimming',
    description: 'Morning swim',
    duration: 30,
    date: new Date('2024-01-01T09:00:00Z'),
  });

  // Save exercise and store its ID
  const savedExercise = await exercise.save();
  exerciseId = savedExercise._id;
});

// Clean up the database after each test
afterEach(async () => {
  await Exercise.deleteMany({});
});

describe('Exercise API Tests', () => {
  /**
   * Test Case 1: POST - Create a new exercise
   */
  it('should create a new exercise with correct data types', async () => {
    const fixedDate = new Date('2024-01-01T10:00:00Z');
    const newExercise = {
      username: 'UserTwo',
      exerciseType: 'Running',
      description: 'Easy run',
      duration: 15,
      date: fixedDate,
    };

    const response = await request(app)
      .post('/exercises/add')
      .send(newExercise);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Exercise added!');
    expect(response.body.exercise).toBeDefined();

    // Validate the structure and data types of the returned exercise
    validateExercise(response.body.exercise, newExercise, false); // isDatabase flag = false

    // Verify that the exercise exists in the database with correct data types
    const exerciseInDb = await Exercise.findOne({ username: 'UserTwo' }).lean();
    validateExercise(exerciseInDb, newExercise, true); // isDatabase = true

  });

  /**
   * Test Case 2: GET - Retrieve all exercises
   */
  it('should retrieve all exercises with correct data types', async () => {
    const response = await request(app).get('/exercises');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1); // Only the exercise from beforeEach

    // Validate each exercise in the array
    response.body.forEach((exercise) => {
      validateExercise(exercise, {
        username: 'UserOne',
        exerciseType: 'Swimming',
        description: 'Morning swim',
        duration: 30,
        date: new Date('2024-01-01T09:00:00Z'),
      }, false); // isDatabase = false
    });
  });

  /**
   * Test Case 3: GET - Retrieve an exercise by ID
   */
  it('should retrieve an exercise by id with correct data types', async () => {
    const response = await request(app).get(`/exercises/${exerciseId}`);
    expect(response.statusCode).toBe(200);

    validateExercise(response.body, {
      username: 'UserOne',
      exerciseType: 'Swimming',
      description: 'Morning swim',
      duration: 30,
      date: new Date('2024-01-02T09:00:00Z'),
    }, false); // isDatabase = false
  });

  /**
   * Test Case 4: PUT - Update an existing exercise
   */
  it('should update an existing exercise with correct data types', async () => {
    const updatedExercise = {
      username: 'UserTwo',
      exerciseType: 'Running',
      description: 'Easy run',
      duration: 45,
      date: new Date('2024-01-01T11:00:00Z'),
    };

    const response = await request(app)
      .put(`/exercises/update/${exerciseId}`)
      .send(updatedExercise);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Exercise updated!');

    // Validate the structure and data types of the updated exercise in the response
    validateExercise(response.body.exercise, {
      username: 'UserTwo',
      exerciseType: 'Running',
      description: 'Easy run',
      duration: 45,
      date: new Date('2024-01-01T11:00:00Z'),
    }, false); // isDatabase = false

    // Verify that the exercise has been updated in the database with correct data types
    const exerciseInDb = await Exercise.findById(exerciseId);
    validateExercise(exerciseInDb, {
      username: 'UserTwo',
      exerciseType: 'Running',
      description: 'Easy run',
      duration: 45,
      date: new Date('2024-01-01T11:00:00Z'),
    }, true); // isDatabase = true
  });

  /**
   * Test Case 5: DELETE - Delete an exercise by ID
   */
  it('should delete an exercise by id with correct data types', async () => {
    const response = await request(app).delete(`/exercises/${exerciseId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Exercise deleted.');

    // Verify that the exercise has been deleted from the database
    const exerciseInDb = await Exercise.findById(exerciseId);
    expect(exerciseInDb).toBeNull();
  });
});
