const express = require('express');
const router = express.Router();
const Question = require('../models/Questions');



// GET route to get all questions
router.get('/', async(req, res) => {
    const questions = await Question.find();
    res.status(200).json(questions);
});

module.exports = router;