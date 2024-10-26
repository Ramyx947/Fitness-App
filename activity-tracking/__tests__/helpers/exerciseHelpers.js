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

// TODO: Sprint 2 - fix or remove test
// // Validate optional fields (deep equality)
//  if (expectedData.description !== undefined) {
//   expect(exercise.description).toEqual(expect.any(String));
//   expect(exercise.description).toBe(expectedData.description);
// }

  // Validate date field
  if (isDatabase) {
    expect(exercise.date.toISOString()).toBe(expectedData.date.toISOString());
  } else {
    expect(new Date(exercise.date).toISOString()).toBe(expectedData.date.toISOString());
  }

  expect(new Date(exercise.date).toString()).not.toBe('Invalid Date');
};

module.exports = {
  validateExercise,
};
