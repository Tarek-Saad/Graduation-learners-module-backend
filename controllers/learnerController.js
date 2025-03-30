const bcrypt = require('bcryptjs');
const LearnerService = require('../services/learnerService');
const { generateToken, verifyToken } = require('../utils/jwtHelper'); // Import the generateToken function
const { getConnection, returnConnection } = require('../config/postgress-conn');



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

const createLearnerClerk = async (req, res) => {
    let client;
  
    try {
      const payload = req.body.data; // 👈 دي أهم سطر
  
      const { email_addresses, first_name, last_name } = payload;
  
      const email = email_addresses?.[0]?.email_address;
  
      if (!email) {
        throw new Error("Missing email from Clerk webhook");
      }
  
      const name = `${first_name || ''} ${last_name || ''}`.trim();
  
      client = await getConnection();
  
      const query = `
        INSERT INTO learner (name, email)
        VALUES ($1, $2)
        RETURNING id, email;
      `;
  
      const result = await client.query(query, [name, email]);
  
      return res.status(201).json({
        learnerId: result.rows[0].id,
        message: "Learner created successfully"
      });
  
    } catch (error) {
      console.error("❌ Error creating learner from Clerk:", error);
      return res.status(500).json({
        message: "Failed to create learner",
        error: error.message
      });
    } finally {
      if (client) returnConnection(client);
    }
  };
  

const handleClerkWebhook = async (req, res) => {
    try {
      const result = await createLearnerClerk(req.body); // ✅ هنا نمرر req.body بس
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to create learner",
        error: error.message
      });
    }
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


module.exports = { getAllLearners, createLearner, updateLearningStyles, updateKnowledgeBaseAndGoals, login, verifyTokenn , handleClerkWebhook , createLearnerClerk };