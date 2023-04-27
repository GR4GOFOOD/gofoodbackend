const express = require('express');
const app = express();
const port = 3000;
const morgan=require("morgan")
app.use(morgan("combined"))
const bodyParser=require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const cors=require("cors");
app.use(cors())
app.listen(port,()=>{
console.log(`My Server listening on port ${port}`)
})
app.get("/",(req,res)=>{
res.send("This Web server is processed for MongoDB")
})
const { MongoClient, ObjectId } = require('mongodb');
client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
database = client.db("FashionData");
fashionCollection = database.collection("Fashion");


database = client.db("PaymentData"); //kết nối tới database
paymentCollection = database.collection("Payment"); //truy suất collection
paymentATMCollection = database.collection("PaymentATM")

//Lệnh này truy vấn toàn bộ Fashion và trả về JsonArray.

app.get("/payments",cors(),async (req,res)=>{
    const result = await paymentCollection.find({}).toArray();
    res.send(result)
})

app.get("/paymentATMs",cors(),async (req,res)=>{
    const result = await paymentATMCollection.find({}).toArray();
    res.send(result)
})

app.post("/payments",cors(),async(req,res)=>{
    //put json Fashion into database
    await paymentCollection.insertOne(req.body)
    //send message to client(send all database to client)
    res.send(req.body)
})

app.post("/paymentATMs",cors(),async(req,res)=>{
    //put json Fashion into database
    await paymentATMCollection.insertOne(req.body)
    //send message to client(send all database to client)
    res.send(req.body)
})

