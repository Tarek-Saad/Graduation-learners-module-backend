require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const serverless = require('serverless-http');



// Initialize Express app
const app = express();

// local mongoDB conn
const connection = require('./conn/connection');
connection();

// Middleware setup
app.use(cors()); // Allow cross-origin requests
app.use(morgan('dev')); // Logging HTTP requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// import routes
const learnerRoutes = require('./routes/learnerRoutes');
const questionsRouter = require('./routes/questions');

// Routes
app.use('/api', learnerRoutes);
app.use('/questions', questionsRouter);

app.get('/', (req, res) => {
    res.send("welcome")
})

// Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

module.exports.handler = serverless(app);