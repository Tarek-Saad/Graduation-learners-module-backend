const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    choice1: {
        type: String,
        required: true
    },
    choice2: {
        type: String,
        required: true
    },
    dimension: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Question', questionSchema);