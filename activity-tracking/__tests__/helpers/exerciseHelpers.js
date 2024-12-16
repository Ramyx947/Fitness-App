const { expect } = require('@jest/globals');
const mongoose = require('mongoose');

/**
 * Validates the structure and data types of an exercise object.
 *
 * @param {Object} exercise - The exercise object to validate.
 * @param {Object} expectedData - An object containing expected values for specific fields.
 * @param {boolean} isDatabase - Flag indicating if the exercise is from the database.
 */
const validateExercise = (exercise, expectedData = {}, isDatabase = false) => {
  if (!exercise) {
    throw new Error("Expected exercise data is undefined");
  }
  // Validate required fields
  expect(exercise.username).toStrictEqual(expect.any(String));
  expect(exercise.exerciseType).toStrictEqual(expect.any(String));
  expect(exercise.duration).toStrictEqual(expect.any(Number));

  if (isDatabase) {
    expect(exercise.date).toBeInstanceOf(Date);
    expect(exercise._id).toBeInstanceOf(mongoose.Types.ObjectId);
    expect(exercise.createdAt).toBeInstanceOf(Date);
    expect(exercise.updatedAt).toBeInstanceOf(Date);
  } else {
    expect(typeof exercise.date).toBe('string');
    expect(typeof exercise._id).toBe('string');
  }

  expect(typeof exercise.__v).toBe('number');

  // Validate date field in UTC format
  const exerciseDateUTC = isDatabase ? exercise.date.toISOString() : new Date(exercise.date).toISOString();
  const expectedDateUTC = new Date(expectedData.date).toISOString();

  // Validate date field
  expect(exerciseDateUTC).toBe(expectedDateUTC);

  // Additional check to confirm valid date
  expect(new Date(exercise.date).toString()).not.toBe('Invalid Date');
};

module.exports = {
  validateExercise,
};
