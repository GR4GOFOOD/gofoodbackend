const express = require('express');
const app = express();
const port = 3000;
const morgan=require("morgan")
app.use(morgan("combined"))
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const bodyParser=require("body-parser")
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));
// app.use(express.json());
const cors=require("cors");
const fileUpload = require("express-fileupload");
app.use(cors())

// app.get("/",(req,res)=>{
// res.send("This Web server is processed for MongoDB")
// })
// const { MongoClient, ObjectId } = require('mongodb');
// client = new MongoClient("mongodb://127.0.0.1:27017");
// client.connect();
// database = client.db("FashionData");
// fashionCollection = database.collection("Fashion");


app.get("/",(req,res)=>{
    res.send("This Web server is processed for MongoDB")
    })
    const { MongoClient, ObjectId } = require('mongodb');
    client = new MongoClient("mongodb://127.0.0.1:27017");
    client.connect();
    database = client.db("Gofoods");
    accountCollection = database.collection("Account");
    app.get("/accounts",cors(),async (req,res)=>{
        const result = await accountCollection.find({}).toArray();
        res.send(result)
        }
        )
//lấy hiện tài khoản theo id
app.get("/users/:id",cors(),async (req,res)=>{
        var o_id = req.params["id"];
        const result = await accountCollection.find({_id:o_id}).toArray();
        res.send(result[0])
        }
        )
        
// app.post("/users",async(req,res)=>{
//           var crypto = require('crypto');
//           const salt = crypto.randomBytes(16).toString('hex');
// app.post("/account",async(req,res)=>{
//           var crypto = require('crypto');
//           const salt = crypto.randomBytes(16).toString('hex');
      
          //  accountCollection = database.collection("users");
          //  user= req.body
//            accountCollection = database.collection("Account");
//            user= req.body
      
//           const hash = crypto.pbkdf2Sync(user.password, salt, 1000, 64, `sha512`).toString(`hex`);
      
//           user.password=hash
//           user.salt=salt
          
//           await accountCollection.insertOne(user)
//           res.send(req.body)
//       })
      
//Đăng nhập
app.post("/login", cors(), async (req, res) => {
  const Email = req.body.Email;
  const password = req.body.password;
  var crypto = require('crypto');
  accountCollection = database.collection("users");
  const user = await accountCollection.findOne({ Email: Email });
  
  if (!user) {
    res.send({ "message": "not exist" });
  } else {
    const salt = user.salt;
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

    if (hash === user.password) {
      const response = {
        code: 200,
        message: "Đăng nhập thành công",
        data: user
      };
      res.send(response);
    } else {
      res.send({ "Email": Email, "password": password, "message": "wrong password" });
    }
  }

  return res.send(1);
});
      
//chỉnh tài khoản
app.put("/user", cors(), async (req, res) => {
        try {
          email=req.body.email
          // Check if the user exists
          accountCollection = database.collection("Account");
          user = await accountCollection.findOne({ email: email });
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
          // Update the user data
          const crypto = require("crypto");
          const salt = crypto.randomBytes(16).toString("hex");
          const hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, "sha512").toString("hex");
      
          user.password = hash;
          user.salt = salt;
          await accountCollection.replaceOne({ Email }, user);
      
          res.send(user)
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal server error" });
        }
      })


app.use(
        fileUpload({
          limit:{
            fileSize: 10000000,
          },
          abortOnLimit: true
        })
      )
app.use(express.static('public'))
app.get("/image/:id", cors(), (req, res)=>{
        id=req.params["id"]
        console.log('upload/'+id)
      })
app.post('/upload', (req, res)=>{
        const {image} = req.files;
        if (!image) return res.sendStatus(400);
      image.mv(__dirname +'/upload'+ image.name);
      res.sendStatus(200)
      })
