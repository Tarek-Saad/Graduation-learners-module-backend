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

    // Update learning styles
    async updateLearningStyles(learnerId, learningStyles) {
        let client;
        try {
            client = await getConnection();
            // Construct the query to update learning styles
            const query = `
                UPDATE learner 
                SET 
                    learning_style_active_reflective = $1,
                    learning_style_visual_verbal = $2,
                    learning_style_sensing_intuitive = $3,
                    learning_style_sequential_global = $4,
                    last_active_date = CURRENT_TIMESTAMP
                WHERE id = $5
                RETURNING id;
                `;

            const result = await client.query(query, [
                learningStyles.learning_style_active_reflective,
                learningStyles.learning_style_visual_verbal,
                learningStyles.learning_style_sensing_intuitive,
                learningStyles.learning_style_sequential_global,
                learnerId
            ]);

            return result.rows[0].id; // Return the ID of the updated learner

        } catch (error) {
            console.error('Error updating learning styles:', error);
            throw error;
        } finally {
            if (client) returnConnection(client);
        }
    }

    // Update knowledge_base and learning_goals
    async updateKnowledgeBaseAndGoals(learnerId, knowledgeBase, learningGoals) {
        let client;
        try {
            client = await getConnection();

            // Ensure knowledge_base and learning_goals are arrays
            if (!Array.isArray(knowledgeBase) || !Array.isArray(learningGoals)) {
                throw new Error("Both knowledge_base and learning_goals must be arrays.");
            }


            // Construct the query to update knowledge base and learning goals
            const query = `
                UPDATE learner
                SET 
                    knowledge_base = $1,
                    learning_goals = $2,
                    last_active_date = CURRENT_TIMESTAMP
                WHERE id = $3
                RETURNING id;
                `;

            const result = await client.query(query, [
                JSON.stringify(knowledgeBase), // Ensure it's a valid JSON string
                JSON.stringify(learningGoals), // Ensure it's a valid JSON string
                learnerId
            ]);

            return result.rows[0].id; // Return the ID of the updated learner

        } catch (error) {
            console.error('Error updating knowledge base and learning goals:', error);
            throw error;
        } finally {
            if (client) returnConnection(client);
        }
    }
}

module.exports = new LearnerService();