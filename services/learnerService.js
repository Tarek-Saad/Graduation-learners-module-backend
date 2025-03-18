const bcrypt = require('bcryptjs');
const { getConnection, returnConnection } = require('../config/postgress-conn');
const LearnerDTO = require('../dtos/learnerDto');

class LearnerService {

    // Fetch all learners
    async getAllLearners() {
        let client;
        try {
            client = await getConnection();
            const result = await client.query('SELECT * FROM learner');
            return result.rows;
        } catch (error) {
            console.error('Error fetching learners:', error);
            return [];
        } finally {
            if (client) returnConnection(client);
        }
    }

    // First Create a new learner 
    async createLearner(learnerData) {
        let client;
        try {
            // Create a DTO and validate the data
            const learnerDTO = LearnerDTO.fromRequest(learnerData);
            // Hash the password
            const hashedPassword = await bcrypt.hash(learnerDTO.password, 10);
            // Get database connection
            client = await getConnection();
            // Insert the learner into the database
            const query = `
                    INSERT INTO learner 
                        (name, email, password_hash, date_of_birth, knowledge_level, learning_goals, knowledge_base, 
                        learning_style_active_reflective, learning_style_visual_verbal, learning_style_sensing_intuitive, 
                        learning_style_sequential_global, preferred_learning_pace, engagement_score, feedback_history)
                    VALUES 
                        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                    RETURNING id;`;

            const result = await client.query(query, [
                learnerDTO.name, learnerDTO.email, hashedPassword, learnerDTO.date_of_birth, learnerDTO.knowledge_level,
                learnerDTO.learning_goals, learnerDTO.knowledge_base, learnerDTO.learning_style_active_reflective,
                learnerDTO.learning_style_visual_verbal, learnerDTO.learning_style_sensing_intuitive,
                learnerDTO.learning_style_sequential_global, learnerDTO.preferred_learning_pace,
                learnerDTO.engagement_score, learnerDTO.feedback_history
            ]);

            // Return the ID of the newly created learner
            return result.rows[0].id;

        } catch (error) {
            console.error('Error creating learner:', error);
            throw error;
        } finally {
            if (client) returnConnection(client);
        }
    }
}

module.exports = new LearnerService();