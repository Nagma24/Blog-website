var Pool = require('pg-pool')
require('dotenv').config()
var pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

module.exports = pool;