const {Client} = require('pg');
let connectionString = process.env.DATABASE_URL;
const con = new Client({connectionString,});
await con.connect()

con.query(`CREATE TABLE user(
	id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(64) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    email VARCHAR(256),
    balance INT
)`)

con.query(`CREATE TABLE product(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64)  NOT NULL,
    description TEXT,
    img VARCHAR(256),
    price INT
)`)

con.query(`CREATE TABLE cart(
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT,
    FOREIGN KEY (user_id) REFERENCES user (id)
)`)

con.query(`CREATE TABLE cart_product(
	id INT AUTO_INCREMENT PRIMARY KEY,
	cart_id INT,
    product_id INT,
    FOREIGN KEY (cart_id) REFERENCES cart (id),
    FOREIGN KEY (product_id) REFERENCES product (id)
)`)

module.exports = con;