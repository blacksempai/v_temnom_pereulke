const {Client} = require('pg');
let connectionString = process.env.DATABASE_URL;
const con = new Client({connectionString, ssl: true});
con.connect()

module.exports = con;