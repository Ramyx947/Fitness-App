const mongoose = require('mongoose');
const Exercise = require('../../models/exercise.model');


beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

describe('Exercise Model Test', () => {
  it('should create and save an exercise successfully', async () => {
    const validExercise = new Exercise({
      username: 'UserOne',
      exerciseType: 'Swimming',
      description: 'Morning swim',
      duration: 30,
      date: new Date(),
    });

    const savedExercise = await validExercise.save();
    expect(savedExercise._id).toBeDefined();
    expect(savedExercise.username).toBe('UserOne');
  });

  it('should fail when required fields are missing', async () => {
    const invalidExercise = new Exercise({
      username: 'UserOne',
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

  it('should fail validation for non-integer duration', async () => {
    const invalidExercise = new Exercise({
      username: 'UserOne',
      exerciseType: 'Swimming',
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
    expect(err.errors.duration.message).toBe('Duration should be an integer.');
  });
});