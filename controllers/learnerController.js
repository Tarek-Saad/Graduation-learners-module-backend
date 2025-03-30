const bcrypt = require('bcryptjs');
const LearnerService = require('../services/learnerService');
const { generateToken, verifyToken } = require('../utils/jwtHelper'); // Import the generateToken function



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
        const { learnerId, token } = await LearnerService.createLearner(req.body);

        res.status(201).json({
            message: 'Learner created successfully',
            learnerId,
            token // Return the token along with the learnerId
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const createLearnerClerk = async (data) => {
    const { id: clerkId, email_addresses, first_name, last_name } = data;
  
    const email = email_addresses?.[0]?.email_address;
  
    if (!email) {
      throw new Error("Missing email from Clerk webhook");
    }
  
    // خزن البيانات في الـ DB بتاعتك
    const learner = await db.learner.create({
      data: {
        clerkId,
        email,
        firstName: first_name,
        lastName: last_name,
      },
    });
  
    // لو عندك logic عايز تبعت بيه توكن
    const token = createCustomToken(learner); // دي optional
  
    return {
      learnerId: learner.id,
      token,
    };
  };
  

const login = async(req, res) => {
    const { email, password } = req.body;
    try {
        // Call the AuthService to authenticate the user
        const { learnerId, token } = await LearnerService.login(email, password);
        res.status(200).json({
            message: 'Login successful',
            learnerId,
            token, // Return the JWT token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const verifyTokenn = async(req, res) => {
    // Get the token from the Authorization header
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(400).json({ error: 'No token provided' });
    }
    try {
        // Verify if the provided token is valid
        const decoded = await verifyToken(token);
        // If the token is valid, return the decoded user info
        res.status(200).json({ message: 'Token is valid', user: decoded });
    } catch (error) {
        res.status(401).json({ error: error.message });
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


module.exports = { getAllLearners, createLearner, updateLearningStyles, updateKnowledgeBaseAndGoals, login, verifyTokenn , createLearnerClerk };