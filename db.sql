CREATE DATABASE v_temnom_pereulke;
USE v_temnom_pereulke;

CREATE TABLE user(
	id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(64) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    email VARCHAR(256),
    balance INT
);

CREATE TABLE product(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64)  NOT NULL,
    description TEXT,
    img VARCHAR(256),
    price INT
);

CREATE TABLE cart(
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT,
    FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE cart_product(
	id INT AUTO_INCREMENT PRIMARY KEY,
	cart_id INT,
    product_id INT,
    FOREIGN KEY (cart_id) REFERENCES cart (id),
    FOREIGN KEY (product_id) REFERENCES product (id)
);

INSERT INTO user(login,password,email,balance) VALUES('user1','11112222','user1@gmail.com',1000);
INSERT INTO user(login,password,email,balance) VALUES('vlad_pochkin','11112222','pochkin@gmail.com',230000);
INSERT INTO user(login,password,email,balance) VALUES('dimASS','11112222','assWEcan@gmail.com',990000);
INSERT INTO user(login,password,email,balance) VALUES('bezGlaza','11112222','glazOK@gmail.com',8000);

INSERT INTO cart(user_id) VALUES(1);
INSERT INTO cart(user_id) VALUES(2);
INSERT INTO cart(user_id) VALUES(3);
INSERT INTO cart(user_id) VALUES(4);

INSERT INTO product(name,description,img,price) VALUES('Почка','Good quality pochka for resionable price. Very fresh, directly from Vova','pochka.png',25000);
INSERT INTO product(name,description,img,price) VALUES('Heart','Heart of Roma. Roma is a man with a BIG heart','heart.png',35000);
INSERT INTO product(name,description,img,price) VALUES('Hand','Good quality RUKA. It can write','hand.png',1900);

INSERT INTO cart_product(cart_id,product_id) VALUES(1,1);
INSERT INTO cart_product(cart_id,product_id) VALUES(2,1);
INSERT INTO cart_product(cart_id,product_id) VALUES(2,1);