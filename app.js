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
    // console.log(result)
    // console.log(product)
    // letresult={"name":"123","category":"123","price":"123"}
    res.render('index', { model: result });
})

app.get('/listProduct', async function (req, res) {
   let client = await MongoClient.connect(url,{useUnifiedTopology: true});
    let dbo = client.db("BabyStore");
    let product = await dbo.collection("Product").find({}).toArray();
    console.log(product)
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
    console.log("data item", result)
    res.render('updateProduct', { model: result });
})
//app.get('/filterCategory', async function (req, res) {
//    let id = req.query.id;
//    let name = req.query.name;
//    var ObjectID = require('mongodb').ObjectID;
//   let client = await MongoClient.connect(url,{useUnifiedTopology: true});
//    let dbo = client.db("ToyStore");
//    let result = await dbo.collection("Products").find({ category: name }).toArray();
//    console.log("data ", result)
//    res.render('showFilter', { model: result });
//})
// app.get('/search', function (req, res) {
//     // res.render();
// })
app.get('/insert', async function (req, res) {
    res.render('insert');
})

app.get('/edit', function (req, res) {
    res.render('edit');
})
// app.get('/search', async function (req, res) {
//     let info = req.query.info;
//     //var ObjectID = require('mongodb').ObjectID;
//    let client = await MongoClient.connect(url,{useUnifiedTopology: true});
//     let dbo = client.db("ToyStore");
//     let result = await dbo.collection("Products").find({ name: new RegExp("^" + info, 'i') }).toArray();
//     // let result = await dbo.collection("Products").findOne({name : /.*d.*/i});;
//     console.log("data search123", result)
//     res.render('listProduct', { list: result });
// })

app.get('/editProduct', async (req, res) => {
    let id = req.query.idProduct;
    console.log("nga query", req.query)
    console.log("nga body", id)
    var ObjectID = require('mongodb').ObjectID;
    let inputName = req.query.name;
    let price = req.query.price;
    let category = req.query.category;
    console.log("text", inputName)
    let updateInfo = { name: inputName, price: price, category: category };
    // let updateInfo = { name: "456", price: "456", category: "456" };
    let client = await MongoClient.connect(url,{useUnifiedTopology: true});
    let dbo = client.db("BabyStore");
    await dbo.collection("Product").updateOne({ _id: ObjectID(id) }, { $set: updateInfo });
    res.redirect('/');

})

app.post('/addProduct', async (req, res) => {
    let client = await MongoClient.connect(url,{useUnifiedTopology: true});
    let dbo = client.db("BabyStore");
    let inputName = req.body.txtName;
    console.log(req.body.txtName)
    let inputPrice = req.body.txtPrice;
    let category = req.body.txtCategory;
    let newProduct = { name: inputName, price: inputPrice, category: category };
    await dbo.collection("Product").insertOne(newProduct);
    res.redirect('/');
})


app.get('/remove', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url,{useUnifiedTopology: true});
    let dbo = client.db("BabyStore");
    await dbo.collection("Product").deleteOne({ _id: ObjectID(id) });
    console.log('1111111111')
    res.redirect('/');

})

const PORT = process.env.PORT || 3000;
app.listen(PORT);

