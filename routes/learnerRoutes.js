const express = require('express');
const router = express.Router();
const LearnerController = require('../controllers/learnerController');

router.get('/learners', LearnerController.getAllLearners);
router.post('/learner', LearnerController.createLearner);
router.patch('/learner/learning-styles', LearnerController.updateLearningStyles);
router.patch('/learner/knowledge-base-goals', LearnerController.updateKnowledgeBaseAndGoals);

module.exports = router;