const mysql2 = require('mysql2');
const con = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'v_temnom_pereulke'
});

module.exports = con;