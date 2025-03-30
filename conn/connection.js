const mongoose = require('mongoose');
require('dotenv').config();

const connection = async() => {
    const env = process.env.NODE_ENV || 'development';

    const dbURI = env === 'production' ?
        process.env.MONGO_URI_PROD :
        process.env.MONGO_URI_LOCAL;

    try {
        await mongoose.connect(dbURI);
        console.log(`Connected to MongoDB (${env})`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // exit app if DB fails to connect
    }
};

module.exports = connection;