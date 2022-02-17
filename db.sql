
CREATE TABLE IF NOT EXISTS users(
	id SERIAL PRIMARY KEY,
    login VARCHAR(64) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    email VARCHAR(256),
    balance INT,
	token VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS product(
	id SERIAL PRIMARY KEY,
    name VARCHAR(64)  NOT NULL,
    description TEXT,
    img VARCHAR(256),
    price INT,
	category VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS cart(
	id SERIAL PRIMARY KEY,
	user_id INT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS cart_product(
	id SERIAL PRIMARY KEY,
	cart_id INT,
    product_id INT,
    FOREIGN KEY (cart_id) REFERENCES cart (id),
    FOREIGN KEY (product_id) REFERENCES product (id)
);

INSERT INTO users(login,password,email,balance) VALUES('gg','gg','gg@gmail.com',1000);
INSERT INTO users(login,password,email,balance) VALUES('vlad_pochkin','11112222','pochkin@gmail.com',230000);
INSERT INTO users(login,password,email,balance) VALUES('dimASS','11112222','assWEcan@gmail.com',990000);
INSERT INTO users(login,password,email,balance) VALUES('bezGlaza','11112222','glazOK@gmail.com',8000);

INSERT INTO cart(user_id) VALUES(1);
INSERT INTO cart(user_id) VALUES(2);
INSERT INTO cart(user_id) VALUES(3);
INSERT INTO cart(user_id) VALUES(4);

INSERT INTO product(name,description,img,price) VALUES('Почка','Good quality pochka for resionable price. Very fresh, directly from Vova','Organs/pochka.png',25000);
INSERT INTO product(name,description,img,price) VALUES('Heart','Heart of Roma. Roma is a man with a BIG heart','Organs/heart.png',35000);
INSERT INTO product(name,description,img,price) VALUES('Hand','Good quality RUKA. It can write','Organs/hand.png',1900);

INSERT INTO cart_product(cart_id,product_id) VALUES(1,1);
INSERT INTO cart_product(cart_id,product_id) VALUES(2,1);
INSERT INTO cart_product(cart_id,product_id) VALUES(2,1);