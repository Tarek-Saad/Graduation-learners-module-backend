// api/index.js

const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
const connection = require('../conn/connection');
connection();

// Routes
const learnerRoutes = require('../routes/learnerRoutes');
const questionsRouter = require('../routes/questions');

app.use('/api', learnerRoutes);
app.use('/questions', questionsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// 👇 Export handler for Vercel
module.exports = app;
module.exports.handler = serverless(app);