const express = require('express');
const engines = require('consolidate');
const app = express();
const mongodb = require('mongodb');
var http = require('http')
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');
var MongoClient = mongodb.MongoClient;
var url = "mongodb+srv://Demo:nga1372000@cluster0.qhdf8.mongodb.net/BabyStore";

app.get('/', async function (req, res) {
    let client = await MongoClient.connect(url,{useUnifiedTopology: true});
    let dbo = client.db("BabyStore");
    let result = await dbo.collection("Product").find({}).toArray();
    res.render('index', { model: result });
})

app.get('/listProduct', async function (req, res) {
   let client = await MongoClient.connect(url,{useUnifiedTopology: true});
    let dbo = client.db("BabyStore");
    let product = await dbo.collection("Product").find({}).toArray();
    res.render('listProduct', { list: product });
})

app.get('/edit', function (req, res) {
    res.render('edit');
})

app.get('/updateProduct', async function (req, res) {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
   let client = await MongoClient.connect(url,{useUnifiedTopology: true});
    let dbo = client.db("BabyStore");
    let result = await dbo.collection("Product").findOne({ _id: ObjectID(id) });
    res.render('updateProduct', { model: result });
})

app.get('/insert', async function (req, res) {
    res.render('insert');
})

app.get('/edit', function (req, res) {
    res.render('edit');
})

app.get('/editProduct', async (req, res) => {
    let id = req.query.idProduct;
    var ObjectID = require('mongodb').ObjectID;
    let inputName = req.query.name;
    let price = req.query.price;
    let category = req.query.category;
    let updateInfo = { name: inputName, price: price, category: category };
    let client = await MongoClient.connect(url,{useUnifiedTopology: true});
    let dbo = client.db("BabyStore");
    await dbo.collection("Product").updateOne({ _id: ObjectID(id) }, { $set: updateInfo });
    res.redirect('/');

})

app.post('/addProduct', async (req, res) => {
    let client = await MongoClient.connect(url,{useUnifiedTopology: true});
    let dbo = client.db("BabyStore");
    let inputName = req.body.txtName;
    let inputPrice = req.body.txtPrice;
    let category = req.body.txtCategory;
    let newProduct = { name: inputName, price: inputPrice, category: category };
    if(category==="Book"||category==="Toy"){
        await dbo.collection("Product").insertOne(newProduct);
        res.redirect('/');
    }
    else{
        let errorABC= {message : 'Chỉ được chọn Book hoặc Toy'}
        res.render('insert', {error : errorABC} );
    }
})


app.get('/remove', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url,{useUnifiedTopology: true});
    let dbo = client.db("BabyStore");
    await dbo.collection("Product").deleteOne({ _id: ObjectID(id) });
    res.redirect('/');

})

const PORT = process.env.PORT || 3000;
app.listen(PORT);

