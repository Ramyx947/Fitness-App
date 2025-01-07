const mongoose = require('mongoose');
const Exercise = require('../../models/exercise.model');
const { validateExercise } = require('../helpers/exerciseHelpers');

describe('Exercise Model Test Suite', () => {
  // Establish DB connection before running the tests
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  /**
   * Test Case 1: Successful creation and saving of an exercise
   */
  it('should create and save an exercise successfully', async () => {
    const validExercise = new Exercise({
      username: 'UserOne',
      exerciseType: 'Swimming',
      description: 'Morning swim',
      duration: 30,
      date: new Date('2024-01-01T10:00:00Z'),
    });

    const savedExercise = await validExercise.save();

    // Convert to plain JS object before validation
    validateExercise(savedExercise.toObject(), {
      username: 'UserOne',
      exerciseType: 'Swimming',
      description: 'Morning swim',
      duration: 30,
      date: new Date('2024-01-01T10:00:00Z'),
    }, true); // isDatabase = true
  });

  /**
   * Test Case 2: Failure when required fields are missing
   */
  it('should fail when required fields are missing', async () => {
    const invalidExercise = new Exercise({
      username: 'UserOne',
      // Missing exerciseType, duration, and date
    });

    let err;
    try {
      await invalidExercise.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.exerciseType).toBeDefined();
    expect(err.errors.duration).toBeDefined();
    expect(err.errors.date).toBeDefined();
  });

  /**
   * Test Case 3: Failure for non-integer duration
   */
  it('should fail validation for non-integer duration', async () => {
    const invalidExercise = new Exercise({
      username: 'UserOne',
      exerciseType: 'Swimming',
      description: 'Morning swim',
      duration: 3.5,
      date: new Date(),
    });

    let err;
    try {
      await invalidExercise.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.duration).toBeDefined();
    expect(err.errors.duration.message).toBe('Duration should be an integer.');
  });

  /**
   * Test Case 4: Failure for invalid exerciseType
   */
  it('should fail validation for invalid exerciseType', async () => {
    const invalidExercise = new Exercise({
      username: 'UserOne',
      exerciseType: 'Dancing',
      description: 'Morning dance session',
      duration: 20,
      date: new Date(),
    });

    let err;
    try {
      await invalidExercise.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.exerciseType).toBeDefined();
    expect(err.errors.exerciseType.message).toContain(
      '`Dancing` is not a valid enum value for path `exerciseType`.'
    );
  });

  /**
   * Test Case 5: Failure for negative duration
   */
  it('should fail validation for negative duration', async () => {
    const invalidExercise = new Exercise({
      username: 'UserOne',
      exerciseType: 'Running',
      description: 'Evening run',
      duration: -10,
      date: new Date(),
    });

    let err;
    try {
      await invalidExercise.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.duration).toBeDefined();
    expect(err.errors.duration.message).toBe('Duration should be positive.');
  });

  /**
   * Test Case 6: Failure for invalid date format
   */
  it('should fail validation for invalid date format', async () => {
    const invalidExercise = new Exercise({
      username: 'UserOne',
      exerciseType: 'Cycling',
      description: 'Afternoon cycling',
      duration: 25,
      date: 'invalid-date',
    });
  
    await expect(invalidExercise.save()).rejects.toThrow(mongoose.Error.ValidationError);
    await expect(invalidExercise.save()).rejects.toMatchObject({
      errors: {
        date: {
          message: expect.stringContaining('Cast to date failed for value "invalid-date"'),
        },
      },
    });
  });
  

  /**
   * Test Case 7: Successful creation without optional fields
   */
  it('should create and save an exercise without optional description', async () => {
    const validExercise = new Exercise({
      username: 'UserTwo',
      exerciseType: 'Running',
      duration: 20,
      date: new Date('2024-02-01T08:00:00Z'),
      // Description is optional and missing
    });

    const savedExercise = await validExercise.save();

    // Convert to plain JS object before validating the saved exercise
    validateExercise(savedExercise.toObject(), validExercise, true); // isDatabase flag = true

    expect(savedExercise.description).toBeUndefined();
  });
});
