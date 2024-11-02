const express = require('express');
const router = express.Router();
const Exercise = require('../models/exercise.model');
const { LogCategory } = require("../logging");
const log = new LogCategory("activity-tracker-exercises.js");

// GET: Retrieve all exercises
router.get('/', async (req, res) => {
    try {
      log.debug("[GET] Retrieve all exercises");
      const exercises = await Exercise.find();
      res.json(exercises);

      log.debug("[GET] Retrieve all exercises success - " + exercises.length + " exercises found");
    } catch (error) {
      res.status(400).json({ error: 'Error: ' + error.message });
      log.error("[GET] 400 Error retrieving all exercises - " + error.message);
    }
  });

// POST: Add a new exercise
router.post('/add', async (req, res) => {
  try {
    const { username, exerciseType, description, duration, date } = req.body;
    const newExercise = new Exercise({
      username,
      exerciseType,
      description,
      duration: Number(duration),
      date: new Date(date),
    });

    log.debug("[POST] Add a new exercise " + JSON.stringify({ username, exerciseType, description, duration: Number(duration), date: Date.parse(data)} ));
    await newExercise.save();

    res.json({ 
      message: 'Exercise added!',
      exercise: savedExercise, // Include the saved exercise in the response
    });
    log.debug("[POST] New exercise added successfully");
  } catch (error) {
    res.status(400).json({ error: 'Error: ' + error.message });
    log.error("[POST] 400 Error adding new exercise - " + error.message);
  }
});

// GET: Retrieve an exercise by ID
router.get('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      res.status(404).json({ error: 'Exercise not found' });
      log.debug("[GET] 404 Error finding exercise by ID - " + req.params.id);
      return;
    }

    res.json(exercise);
    log.debug("[GET] Retrieve exercise by ID - " + JSON.stringify(exercise));
  } catch (error) {
    res.status(400).json({ error: 'Error: ' + error.message });
    log.error("[GET] 400 Error retrieving exercise by ID - " + error.message);
  }
});

// DELETE: Delete an exercise by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!deletedExercise) {
      res.status(404).json({ error: 'Exercise not found' });
      log.debug("[DELETE] 404 Error deleting exercise " + req.params.id);
      return;
    }
    res.json({ message: 'Exercise deleted.' });
    log.debug("[DELETE] Error deleting exercise");
  } catch (error) {
    res.status(400).json({ error: 'Error: ' + error.message });
    log.error("[DELETE] 400 Error deleting exercise - " + error.message);
  }
});

// PUT: Update an exercise by ID
router.put('/update/:id', async (req, res) => {
    try {
      const { username, exerciseType, description, duration, date } = req.body;
  
      if (!username || !exerciseType || !description || !duration || !date) {
        log.debug("[PUT] 400 Error updating exercise - missing required field");
        return res.status(400).json({ error: 'All fields are required' });

      const exercise = await Exercise.findById(req.params.id);
      if (!exercise) {
        log.debug("[PUT] 400 Error updating exercise - exercise not found " + req.params.id);
        return res.status(404).json({ error: 'Exercise not found' });
      }

      exercise.username = username;
      exercise.exerciseType = exerciseType;
      exercise.description = description;
      exercise.duration = Number(duration);
      exercise.date = new Date(date);
      log.debug("[PUT] Updating exercise " + JSON.stringify(exercise));
  
      await exercise.save();
      res.json({ message: 'Exercise updated!', exercise });
      log.debug("[PUT] Exercise updated successfully");
    } catch (error) {
      log.error("[PUT] 500 Error updating exercise - " + error.message);
      res.status(500).json({ error: 'An error occurred while updating the exercise' });
    }
  });
  
  module.exports = router;
