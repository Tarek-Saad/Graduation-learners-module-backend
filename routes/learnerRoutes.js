const express = require('express');
const router = express.Router();
const LearnerController = require('../controllers/learnerController');

router.get('/learners', LearnerController.getAllLearners);
router.post('/learner', LearnerController.createLearner);

module.exports = router;