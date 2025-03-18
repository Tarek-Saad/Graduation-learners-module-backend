const { Pool } = require('pg');

// Connection URI for PostgreSQL
const POSTGRESS_URI = process.env.POSTGRESS_URI || "postgresql://learningPath_owner:npg_wxF56SGTMWbC@ep-patient-lake-a8rcnxyp-pooler.eastus2.azure.neon.tech/learningPath?sslmode=require";

// Create a connection pool
const pool = new Pool({
    connectionString: POSTGRESS_URI,
});

const getConnection = async() => {
    try {
        const client = await pool.connect(); // الحصول على اتصال من المجمع
        return client;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};

const returnConnection = (client) => {
    if (client) {
        client.release();
    }
};

module.exports = { getConnection, returnConnection };