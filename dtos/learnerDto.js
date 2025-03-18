// dtos/learnerDto.js

class LearnerDTO {
    constructor({
        name,
        email,
        password,
        date_of_birth = null,
        knowledge_level = 1, // Default to 1 to avoid the constraint violation
        learning_goals = [], // Default value for learning_goals (empty array)
        knowledge_base = [], // Default value for knowledge_base (empty array)
        learning_style_active_reflective = 0.5, // Default value
        learning_style_visual_verbal = 0.5, // Default value
        learning_style_sensing_intuitive = 0.5, // Default value
        learning_style_sequential_global = 0.5, // Default value
        preferred_learning_pace = "medium", // Default value
        engagement_score = 0.5, // Default value
        feedback_history = "", // Default value (empty string)
    }) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.date_of_birth = date_of_birth;
        this.knowledge_level = knowledge_level < 1 ? 1 : (knowledge_level > 10 ? 10 : knowledge_level); // Ensure within range [1, 10]
        this.learning_goals = learning_goals;
        this.knowledge_base = knowledge_base;
        this.learning_style_active_reflective = learning_style_active_reflective;
        this.learning_style_visual_verbal = learning_style_visual_verbal;
        this.learning_style_sensing_intuitive = learning_style_sensing_intuitive;
        this.learning_style_sequential_global = learning_style_sequential_global;
        this.preferred_learning_pace = preferred_learning_pace;
        this.engagement_score = engagement_score;
        this.feedback_history = feedback_history;
    }

    // Method to validate required fields
    static validate(learnerData) {
        const errors = [];
        if (!learnerData.name) {
            errors.push("Name is required");
        }
        if (!learnerData.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(learnerData.email)) {
            errors.push("Valid email is required");
        }
        if (!learnerData.password || learnerData.password.length < 6) {
            errors.push("Password must be at least 6 characters long");
        }

        return errors;
    }

    // Static method to create a DTO from the raw input data
    static fromRequest(learnerData) {
        const errors = LearnerDTO.validate(learnerData);
        if (errors.length > 0) {
            throw new Error(errors.join(", "));
        }

        // Return a new DTO instance with default values and validation
        return new LearnerDTO(learnerData);
    }
}

module.exports = LearnerDTO;