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

const updateLearningStyles = async(req, res) => {
    const { learnerId, learning_style_active_reflective, learning_style_visual_verbal, learning_style_sensing_intuitive, learning_style_sequential_global } = req.body;
    try {
        // Update learning styles
        const updatedLearnerId = await LearnerService.updateLearningStyles(learnerId, {
            learning_style_active_reflective,
            learning_style_visual_verbal,
            learning_style_sensing_intuitive,
            learning_style_sequential_global
        });
        res.status(200).json({ message: 'Learning styles updated successfully', learnerId: updatedLearnerId });
    } catch (error) {
        res.status(500).json({ error: 'Error updating learning styles' });
    }
}

const updateKnowledgeBaseAndGoals = async(req, res) => {
    const { learnerId, knowledge_base, learning_goals } = req.body;
    try {
        // Update knowledge base and learning goals
        const updatedLearnerId = await LearnerService.updateKnowledgeBaseAndGoals(learnerId, knowledge_base, learning_goals);

        res.status(200).json({ message: 'Knowledge base and learning goals updated successfully', learnerId: updatedLearnerId });
    } catch (error) {
        res.status(500).json({ error: 'Error updating knowledge base and learning goals' });
    }
}


module.exports = { getAllLearners, createLearner, updateLearningStyles, updateKnowledgeBaseAndGoals };