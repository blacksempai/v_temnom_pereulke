const {Client} = require('pg');
let connectionString = process.env.DATABASE_URL;
const con = new Client({connectionString, ssl: true});
con.connect()

con.query(`CREATE TABLE IF NOT EXISTS users(
	id SERIAL PRIMARY KEY,
    login VARCHAR(64) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    email VARCHAR(256),
    balance INT,
	token VARCHAR(256)
)`,(e,r)=>{})

con.query(`CREATE TABLE IF NOT EXISTS product(
	id SERIAL PRIMARY KEY,
    name VARCHAR(64)  NOT NULL,
    description TEXT,
    img VARCHAR(256),
    price INT,
	category VARCHAR(256)
)`,(e,r)=>{})

con.query(`CREATE TABLE IF NOT EXISTS cart(
	id SERIAL PRIMARY KEY,
	user_id INT,
    FOREIGN KEY (user_id) REFERENCES users (id)
)`,(e,r)=>{})

con.query(`CREATE TABLE IF NOT EXISTS cart_product(
	id SERIAL PRIMARY KEY,
	cart_id INT,
    product_id INT,
    FOREIGN KEY (cart_id) REFERENCES cart (id),
    FOREIGN KEY (product_id) REFERENCES product (id)
)`,(e,r)=>{})

module.exports = con;