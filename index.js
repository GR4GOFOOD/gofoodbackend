const express = require('express');
const app = express();
const port = 3000;
const morgan=require("morgan")
app.use(morgan("combined"))
const bodyParser=require("body-parser")
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));

app.use(express.json({limit:'10mb '}))
app.use(express.urlencoded({limit:'10mb'}));
app.use(express.json());

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

app.get("/fashions", cors(), async (reg, res)=>{
    const result = await fashionCollection.find({}).toArray();
    res.send(result)
    },
    app.get("/fashions/:id", cors(),async(req, res)=>{
      var o_id = new ObjectId(req.params["id"]);
      const result = await fashionCollection.find({_id:o_id}).toArray();
      res.send(result[0])
    }),
    app.post("/fashions", cors(),async(req, res)=>{     
      await fashionCollection.insertOne(req.body)
      res.send(req.body)
    }),
    app.put("/fashions", cors(),async(req, res)=>{
      //update json Fashion into database
      await fashionCollection.updateOne(
        {_id:new ObjectId(req.body._id)},//condition for update
        {$set: {
          style: req.body.style,
          fashion_subject: req.body.fashion_subject,
          fashion_detail: req.body.fashion_detail,
          fashion_image: req.body.fashion_image
        }}
      )
      //send Fashion after updating
      var o_id= new ObjectId(req.body._id);
      const result = await fashionCollection.find({_id:o_id}).toArray();
      res.send(result[0])
    }
    )
    )
    app.delete("/fashions/:id",cors(),async(req, res)=>{
      //find detail Fashion with id
      var o_id = new ObjectId(req.params["id"]);
      const result = await fashionCollection.find({_id:o_id}).toArray();
      //update json  Fashion into database
      await fashionCollection.deleteOne(
        {_id:o_id}
      )
      //send Fashion after remove
      res.send(result[0])
    })
    var session =require("express-session");
    const {hasSubscribers} =require ('diagnostics_channel');
    app.use(session({secret: "Shh, its a secret!"}));
    app.get("/contact",cors(),(req,res)=>{
      if(req.session.visited!=null)
      {
        req.session.visited++
        res.send("You visited this page" + req.session.visited+"times")
      }
      else 
      {
        req.session.visited=1
        res.send("Welcome to this page for the first time!")
      }
    })
    
// giỏ hàng
app.post("/cart", cors(),(req,res)=>{
    product =req.body
    if(req.session.carts ==null)
    req.session.carts=[]
    req.session.carts.push(product)
    res.send(product)
})
app.get("/cart", cors(),(req,res)=>{
    res.send(req.session.carts)
})
app.get("/cart/:id",cors(),(req,res)=>{
if (req.session.carts!=null){
    p =req.session.carts.find(x=>x.barcode==req.body.barcode)
    res.send(p)
}
else
res.send(null)
})
app.delete("/cart/:id",cors(),(req,res)=>{
    if(res.session.carts!=null)
    {
        id=req.params["id"]
        req.session.carts =req.session.carts.filter(x => x.barcode !==id);

    }
    res.send(req.session.carts)
})
app.put("/cart", cors(),(req,res)=>{
    if(req.session.carts!=null){
        p=req.session.carts.find(x=>x.barcode ==req.body.barcode)
        if(p!=null)
        {
            p.quantity=req.body.quantity
        }
    }
    res.send(req.session.cart)
})

    