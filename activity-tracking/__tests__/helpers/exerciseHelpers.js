const { expect } = require('@jest/globals');

/**
 * Validates the structure and data types of an exercise object.
 *
 * @param {Object} exercise - The exercise object to validate.
 * @param {Object} expectedData - An object containing expected values for specific fields.
 */
const validateExerciseStructure = (exercise, expectedData = {}) => {
  if (!exercise) {
    throw new Error("Expected exercise data is undefined");
  }
  // Define the expected structure
  const expectedExerciseStructure = {
    username: expect.any(String),
    exerciseType: expect.any(String),
    description: expect.any(String),
    duration: expect.any(Number),
    date: expect.any(String), // Dates are typically returned as ISO strings
    _id: expect.any(String),  // MongoDB assigns an _id field
    __v: expect.any(Number),  // Mongoose version key
  };

  // Validate the overall structure
  expect(exercise).toMatchObject(expectedExerciseStructure);

  // Validate specific fields if expectedExerciseData is provided
  Object.keys(expectedData).forEach((key) => {
    if (key === 'date') {
      // Convert both dates to ISO strings for comparison
      expect(new Date(exercise[key]).toISOString()).toBe(expectedData[key].toISOString());
    } else {
      expect(exercise[key]).toStrictEqual(expectedData[key]);
    }
  });

  expect(new Date(exercise.date).toString()).not.toBe('Invalid Date');
};

/**
 * Validates that an exercise exists in the database with correct data types.
 *
 * @param {Object} exerciseInDb - The exercise object retrieved from the database.
 * @param {Object} expectedData - An object containing expected values for specific fields.
 */
const validateExerciseInDatabase = (exerciseInDb, expectedData = {}) => {
  expect(exerciseInDb).not.toBeNull();

  Object.keys(expectedData).forEach((key) => {
    if (key === 'date') {
      if (exerciseInDb[key] instanceof Date) {
        // Compare dates
        expect(exerciseInDb[key]).toEqual(expectedData[key]);
      } else {
        // If it's not an object, convert to Date and then compare
        expect(new Date(exerciseInDb[key]).toISOString()).toBe(expectedData[key].toISOString());
      }
    } else {
      expect(exerciseInDb[key]).toStrictEqual(expectedData[key]);
    }


    // Validate data types
    switch (key) {
      case 'username':
      case 'exerciseType':
      case 'description':
        expect(typeof exerciseInDb[key]).toBe('string');
        break;
      case 'duration':
        expect(typeof exerciseInDb[key]).toBe('number');
        break;
      case 'date':
        expect(exerciseInDb[key]).toBeInstanceOf(Date);
        break;
      default:
        break;
    }
  });
};

module.exports = {
  validateExerciseStructure,
  validateExerciseInDatabase,
};
