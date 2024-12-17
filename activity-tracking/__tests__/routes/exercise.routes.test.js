const request = require('supertest');
const mockingoose = require('mockingoose');
const mongoose = require('mongoose');
const Exercise = require('../../models/exercise.model');
const app = require('../../server');
const { validateExercise } = require('../helpers/exerciseHelpers');

describe('Exercise API Tests', () => {
  // Define mock data
  const mockExercise = {
    _id: new mongoose.Types.ObjectId(),
    username: 'UserOne',
    exerciseType: 'Swimming',
    description: 'Morning swim',
    duration: 30,
    date: '2024-01-01T10:00:00Z',
    __v: 0,
  };  

  beforeEach(() => {
    mockingoose.resetAll();
  });

  /**
   * Test Case 1: POST - Create a new exercise
   */
  it('should create a new exercise with correct data types', async () => {
    // Mock the save method to return the new exercise
    mockingoose(Exercise).toReturn(mockExercise, 'save');

    const response = await request(app)
      .post('/exercises/add')
      .send({
        username: 'UserOne',
        exerciseType: 'Swimming',
        description: 'Morning swim',
        duration: 30,
        date: '2024-01-01T10:00:00Z',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Exercise added!');
    expect(response.body.exercise).toBeDefined();

    // Validate the structure and data types of the returned exercise
    validateExercise(response.body.exercise, mockExercise, false);
  });

  /**
   * Test Case 2: GET - Retrieve all exercises
   */
  it('should retrieve all exercises with correct data types', async () => {
    // Mock the find method to return an array of exercises
    mockingoose(Exercise).toReturn([mockExercise], 'find');

    const response = await request(app).get('/exercises');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);

    // Validate each exercise in the array
    response.body.forEach((exercise) => {
      validateExercise(exercise, mockExercise, false);
    });
  });

  /**
   * Test Case 3: GET - Retrieve an exercise by ID
   */
  it('should retrieve an exercise by id with correct data types', async () => {
    // Mock the findById method to return the mock exercise
    mockingoose(Exercise).toReturn(mockExercise, 'findOne');

    const response = await request(app).get(`/exercises/${mockExercise._id}`);

    expect(response.statusCode).toBe(200);
    validateExercise(response.body, mockExercise, false);
  });

  /**
   * Test Case 4: PUT - Update an existing exercise
   */
  it('should update an existing exercise with correct data types', async () => {
    const updatedExercise = {
      ...mockExercise,
      exerciseType: 'Running',
      duration: 45,
    };

    // Mock findById to return the original exercise
    mockingoose(Exercise).toReturn(mockExercise, 'findOne');

    // Mock save to return the updated exercise
    mockingoose(Exercise).toReturn(updatedExercise, 'save');

    const response = await request(app)
      .put(`/exercises/update/${mockExercise._id}`)
      .send(updatedExercise);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Exercise updated!');
    validateExercise(response.body.exercise, updatedExercise, false);
  });

  /**
   * Test Case 5: DELETE - Delete an exercise by ID
   */
  it('should delete an exercise by id with correct data types', async () => {
    // Mock findByIdAndDelete to return the mock exercise
    mockingoose(Exercise).toReturn(mockExercise, 'findOneAndDelete');
  
    // Mock findById to return null after deletion
    mockingoose(Exercise).toReturn(null, 'findOne');
  
    const response = await request(app).delete(`/exercises/${mockExercise._id}`);
  
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Exercise deleted.');
  
    // Verify that the exercise has been deleted
    const exerciseInDb = await Exercise.findById(mockExercise._id);
    expect(exerciseInDb).toBeNull();
  });
});
