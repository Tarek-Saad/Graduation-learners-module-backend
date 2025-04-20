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

app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
    origin: ['http://localhost:3000', 'https://codengo.vercel.app', '*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // if needed for cookies
};

app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'https://portfolio-ten-jet-74.vercel.app');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
}

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