const express = require('express');
const sha1 = require('js-sha1');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const con = require('./config');
const res = require('express/lib/response');
const app = express();
app.use(express.urlencoded({extended: true}));
app.listen(process.env.PORT || 3000);
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

app.post('/callback', (req,res)=>{
    let pay = req.body;
    if(pay.order_status == 'approved'){
        con.query(`SELECT * FROM users WHERE id = ${pay.product_id}`,(e,r)=>{
            let balance = r.rows[0].balance + 1000;
            con.query(`UPDATE users SET balance = '${balance}' WHERE id = ${pay.product_id}`,(e,res)=>{

            });
        });
    }
    res.status(200).end();
})

app.post('/', (req,res)=>{
    console.log(req.body);
    res.redirect('/');
})

app.get('/user',(req,res)=>{
    let token = req.cookies.token;
    con.query(`SELECT * FROM users WHERE token = '${token}'`,(e,result)=>{
        if(e) res.redirect('/error.html');
        else {  
            let rand= Math.floor(Math.random()*9000 + Math.random()*2000 + Math.random()*10000);
            let pay = {
                request: {
                  order_id: "temniy"+rand,
                  order_desc: "Верни карточку мамке",
                  currency: "USD",
                  amount: 100000,
                  merchant_id: "1397120",
                  product_id: result.rows[0].id,
                  response_url: "https://v-temnom-magaze.herokuapp.com/",
                  server_callback_url: "https://v-temnom-magaze.herokuapp.com/callback"
                }
              }
            let signature = sha1('test'+"|"+pay.request.amount+"|"+pay.request.currency+"|"+pay.request.merchant_id+"|"+pay.request.order_desc+"|"+pay.request.order_id+"|"+pay.request.product_id+"|"+pay.request.response_url+"|"+pay.request.server_callback_url); 
            pay.request.signature = signature;
            res.send(`
            <body style="background:#000000; color: #00ff00; font-family: sans-serif; padding: 5rem 0 0">
            <center>
            <h1>Profile of: ${result.rows[0].login}</h1>
            <h1>Your balance: ${result.rows[0].balance}$</h1>
            <form name="tocheckout" method="POST" action="https://pay.fondy.eu/api/checkout/redirect/">
            <input type="text" hidden name="server_callback_url" value="${pay.request.server_callback_url}">
            <input type="text" hidden name="response_url" value="${pay.request.response_url}">
            <input type="text" hidden name="order_id" value="${pay.request.order_id}">
            <input type="text" hidden name="order_desc" value="${pay.request.order_desc}">
            <input type="text" hidden name="currency" value="${pay.request.currency}">
            <input type="text" hidden name="amount" value="${pay.request.amount}">
            <input type="text" hidden name="signature" value="${pay.request.signature}">
            <input type="text" hidden name="product_id" value="${pay.request.product_id}">
            <input type="text" hidden name="merchant_id" value="${pay.request.merchant_id}">
            <input style="margin-top:20px; cursor: pointer;  color: #000000; font-size: 3rem; background-color: rgb(255, 255, 103); border-radius:15px; display:inline-block; padding:20px;" type="submit" value="Top up balance">
          </form>
            <a style="margin-top:20px; border: 1px solid #000000; text-decoration:none; color: #000000; font-size: 3rem; background-color: rgb(255, 255, 103); border-radius:15px; display:inline-block; padding:20px;" href="/">Go to Home Page</a>
            </center>
            </body>
        `);
        }
    });
});

app.post('/user',(req,res) => {
    let user = req.body;
    con.query(`INSERT INTO 
    users(login,password,email,balance)
    VALUES('${user.login}','${user.password}','${user.email}',0) `,
    (e,result) => {
        if(e) res.send(e);
        else {
            console.log(result);
            let userId = result.rows[0].insertId;
            con.query(`INSERT INTO cart(user_id) VALUES(${userId})`,(e,result)=>{
                if(e) res.status(500).end();
                else res.redirect('login.html');
            });
        }
    })
});

app.get('/product',(req,res)=>{
    if(req.cookies.token){
        let token = req.cookies.token;
        con.query(`SELECT * FROM users WHERE token = '${token}'`,(e,result)=>{
            if(e) res.send(e);
            else if(result.rows){
                con.query('SELECT * FROM product', (e,result) => {
                    if(e) res.send(e);
                    else res.send(JSON.stringify(result.rows));
                });
            }
            else {
                res.status(401).redirect('/error.html');
            }
        })

    }

});

app.post('/product', (req,res) => {
    let product = req.body;
    con.query(`INSERT INTO 
    product(name,price,description,img,category)
    VALUES('${product.name}',${product.price},'${product.description}','${product.img}','${product.category}')`,
    (e,result) => {
        if(e) res.redirect('/error.html');
        else res.redirect('/');
    })
});


app.post('/login' , (req , res)=>{
    let user = req.body;
    con.query(`SELECT id, login, password FROM users WHERE login = '${user.login}'`,
    (error, result) => {
        console.log(result)
        if (error) 
            res.status(500).send('DataBase ErroR ' + error);
        else
        if(result.rows){
            if (result.rows[0].password == user.password) {
                auth(result.rows[0].id,res);
            }
            else res.status(401).send("Wrong Pass"); 
        }
        else res.status(401).send("Wrong Login");                
})
});


function auth(id,res) {
    let token = generateToken();
    con.query(`UPDATE users SET token = '${token}' WHERE id = ${id}`, 
    (error, result) =>{
        if(error) res.status(500).send(error);
        else res.status(200).send(token);
    });
}

function generateToken() {
    return crypto.randomBytes(64).toString('hex');
};

app.get('/logout',(req,res)=>{
    res.clearCookie('token');
    res.redirect('index.html');
})

app.get('/cart',(req,res)=>{
    let id = req.query.id;
    let token = req.cookies.token;
    con.query(`SELECT * FROM users WHERE token = '${token}'`, (e, result)=>{
        if(e) res.status(500).redirect('/error.html');
        else {
            let userId = result.rows[0].id;
            con.query(`SELECT * FROM cart WHERE user_id = ${userId}`, (e, result)=>{
                if(e) res.status(500).redirect('/error.html');
                else {
                    let cartId = result.rows[0].id;
                    con.query(`INSERT INTO cart_product(cart_id,product_id)
                     VALUES(${cartId},${id})`,(e,result)=>{
                        if(e) res.status(500).redirect('/error.html');
                        else {
                            res.status(201).redirect('/shop.html');
                        }
                    })
                }
            })
        }
    })
})

app.get('/cart/products', (req,res)=>{
    let token = req.cookies.token;
    con.query(`SELECT * FROM users WHERE token = '${token}'`, (e, result)=>{
        if(e) res.status(500).send(e);
        else {
            let userId = result.rows[0].id;
            con.query(`SELECT * FROM cart WHERE user_id = ${userId}`, (e, result)=>{
                if(e) res.status(500).send(e);
                else {
                    let cartId = result.rows[0].id;
                    con.query(`SELECT * FROM cart_product WHERE cart_id = ${cartId}`, (e,cp)=>{
                        if(e) res.status(500).send(e);
                        con.query(`SELECT * FROM product`, (e,products)=>{
                            let a = [];
                            cp.rows.forEach((p)=>{
                                let productId = p.product_id;
                                let product = products.rows.find((pp)=>pp.id == productId);
                                let cart_p = {
                                    product: product,
                                    id: p.id
                                }
                                a.push(cart_p);
                            })
                            res.status(200).send(a);
                        })
                    })
                }
            });
        }
    });
})

app.get("/remove-from-cart", (req, res) => {
    let cart_product_id = req.query.id;
    con.query(`DELETE FROM cart_product WHERE id=${cart_product_id}`, (error, result) => {
        if (error) res.status(500).redirect('/error.html');
        else {
            res.redirect("/shop.html"); 
            }
        });
});

app.post('/withdraw', (req,res)=>{
    let token = req.cookies.token;
    con.query(`SELECT * FROM users WHERE token = '${token}'`, (e, result)=>{
        if(e) res.status(500).send(e);
        else {
            let balance = result.rows[0].balance;
            let userId = result.rows[0].id;
            con.query(`SELECT * FROM cart WHERE user_id = ${userId}`, (e, result)=>{
                if(e) res.status(500).send(e);
                else {
                    let cartId = result.rows[0].id;
                    con.query(`SELECT * FROM cart_product WHERE cart_id = ${cartId}`, (e,cp)=>{
                        if(e) res.status(500).send(e);
                        con.query(`SELECT * FROM product`, (e,products)=>{
                            let sum = 0;
                            cp.rows.forEach((p)=>{
                                let productId = p.product_id;
                                let product = products.rows.find((pp)=>pp.id == productId);
                                sum += product.price;
                            })
                            if(balance > sum) {
                                con.query(`DELETE FROM cart_product WHERE cartId=${cartId}`, (error, result) => {
                                    con.query(`UPDATE users SET balance = '${balance - sum}' WHERE id = ${userId}`,(e,rs)=>{
                                        res.status(200).send();
                                    });
                                    });
                            }
                            else {
                                res.status(401).send();
                            }
                        })
                    })
                }
            });
        }
    });
})

process.on('uncaughtException', err => {
    console.error(err && err.stack)
});