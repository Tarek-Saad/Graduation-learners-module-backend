const LearnerService = require('../services/learnerService');

const getAllLearners = async(req, res) => {
    try {
        const learners = await LearnerService.getAllLearners();
        res.json(learners);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching learners' });
    }
}


const createLearner = async(req, res) => {
    try {
        // Call the service to create a learner
        const learnerId = await LearnerService.createLearner(req.body);
        res.status(201).json({ message: 'Learner created successfully', learnerId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { getAllLearners, createLearner };