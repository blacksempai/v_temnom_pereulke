const express = require('express');
const sha1 = require('js-sha1');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const con = require('./config');
const fetch = require('node-fetch');
const multer = require('multer');
const res = require('express/lib/response');
const app = express();
app.use(express.urlencoded({extended: true}));
app.listen(process.env.PORT || 3000);
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, '/public/Organs');
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname);
    }
  });

app.post('/callback', (req,res)=>{
    console.log(req.body);
    res.status(200).end();
})

app.get('/user',(req,res)=>{
    let token = req.cookies.token;
    con.query(`SELECT * FROM users WHERE token = '${token}'`,(e,result)=>{
        if(e) res.redirect('/error.html');
        else {  
            let rand= Math.floor(Math.random*900000);
            let pay = {
                request: {
                  order_id: "temniy"+rand,
                  order_desc: "Отдай мамке карточку",
                  currency: "USD",
                  amount: 1000,
                  merchant_id: "1397120",
                  product_id: result.rows[0].id,
                  //response_url: "https://v-temnom-magaze.herokuapp.com/",
                  //server_callback_url: "https://v-temnom-magaze.herokuapp.com/callback"
                  response_url: "https://api.fondy.eu/responsepage/"
                }
              }
            let signature = sha1('test'+"|"+pay.request.amount+"|"+pay.request.currency+"|"+pay.request.merchant_id+"|"+pay.request.order_desc+"|"+pay.request.order_id+"|"+pay.request.product_id+"|"+pay.request.response_url); 
            pay.request.signature = signature;
            fetch('https://pay.fondy.eu/api/checkout/url/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(pay)
              }).then(res => res.json())
              .then((json)=>{
                let url = json.response.checkout_url; 
                res.send(`
                <h1>Ваш баланс: ${result.rows[0].balance}</h1>
                <h2>Пополнить баланс: </h2>
                <div id="fondyApplePay"> </div>
                <a href="/">Go back to home page</a>
                <script src="https://pay.fondy.eu/static_common/v1/checkout/ipsp.js"></script>
                <script> $ipsp.get('checkout').config({
                    'wrapper': '#frameholder' ,
                    'styles' : {
                        'body':{'overflow':'hidden'},
                        '.page-section-shopinfo':{display:'none'},
                        '.page-section-footer':{display:'none'}
                    }
                }).scope(function(){
                    this.width(480);
                    this.height(480);
                    this.action('decline',function(data,type){
                        console.log(data);
                    });
                    this.action('message',function(data,type){
                        console.log(data);
                    });
                    this.loadUrl(${url});
                });</script>
            `);
              })
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
                res.status(401).send('Error 401 Login Please');
            }
        })

    }

});

app.post('/product',(req,res) => {
    let product = req.body;
    con.query(`INSERT INTO 
    product(name,price,description,img,category)
    VALUES('${product.name}',${product.price},'${product.description}','${product.img}','${product.category}')`,
    (e,result) => {
        if(e) res.send(e);
        else res.send('SUCCESS');
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
        if(e) res.status(500).end();
        else {
            let userId = result.rows[0].id;
            con.query(`SELECT * FROM cart WHERE user_id = ${userId}`, (e, result)=>{
                if(e) res.status(500).end(e);
                else {
                    let cartId = result.rows[0].id;
                    con.query(`INSERT INTO cart_product(cart_id,product_id)
                     VALUES(${cartId},${id})`,(e,result)=>{
                        if(e) res.status(500).end(e);
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
                            cp.forEach((p)=>{
                                let productId = p.product_id;
                                let product = products.find((pp)=>pp.id == productId);
                                a.push(product);
                            })
                            res.status(200).send(a);
                        })
                    })
                }
            });
        }
    });
})
