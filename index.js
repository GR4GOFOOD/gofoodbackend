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
database = client.db("Gofoods");
usersCollection = database.collection("users");
const crypto = require('crypto');
// app.post("/users",cors(),async(req,res)=>{
//     var crypto = require('crypto');
//     salt = crypto.randomBytes(16).toString('hex');

//     userCollection = database.collection("users");
//     username = req.body
//      email = req.body


//     hash = crypto.pbkdf2Sync(username.password, salt, 1000, 64,`sha512`).toString(`hex`);

//     username.password = hash
//     username.salt = salt

//     await userCollection.insertOne(user)

//     res.send(req.body)
// })
// app.post("/users", cors(), async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Tạo salt ngẫu nhiên
//     const salt = crypto.randomBytes(16).toString('hex');

//     // Tạo hash từ mật khẩu và salt
//     const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

//     // Lưu thông tin vào cơ sở dữ liệu
//     userCollection = database.collection("users");
//     await userCollection.insertOne({
//       username: username,
//       email: email,
//       password: hash,
//       salt: salt
//     });

//     res.send(req.body);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Đã xảy ra lỗi trong quá trình đăng ký người dùng");
//   }
// });

app.post("/users", cors(), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra trùng lặp username hoặc email trong cơ sở dữ liệu
    const userCollection = database.collection("users");
    const existingUser = await userCollection.findOne({
      $or: [
        { email: email }
      ]
    });

    if (existingUser) {
      // Trùng lặp username hoặc email, trả về lỗi
      return res.status(400).send("Email đã tồn tại");
    }

    // Tạo salt ngẫu nhiên
    const salt = crypto.randomBytes(16).toString('hex');

    // Tạo hash từ mật khẩu và salt
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    // Lưu thông tin vào cơ sở dữ liệu
    await userCollection.insertOne({
      email: email,
      password: hash,
      salt: salt
    });

    res.send(req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send("Đã xảy ra lỗi trong quá trình đăng ký người dùng");
  }
  
});

// app.post("/users", cors(), async (req, res) => {
//   var crypto = require('crypto');
//   var salt = crypto.randomBytes(16).toString('hex');

//   var userCollection = database.collection("users");
//   var username = req.body.username; // Lưu ý: Đảm bảo rằng trường username được đặt tên chính xác trong req.body
//   var email = req.body.email; // Lưu ý: Đảm bảo rằng trường email được đặt tên chính xác trong req.body

//   var hash = crypto.pbkdf2Sync(username.password, salt, 1000, 64, `sha512`).toString(`hex`);

//   username.password = hash;
//   username.salt = salt;

//   await userCollection.insertOne(username); // Lưu ý: Sử dụng biến username thay vì user

//   res.send(req.body);
// });

// app.post("/users", cors(), async (req, res) => {
//     const { username, email, password } = req.body;
  
//     // Generate a random salt
//     const salt = crypto.randomBytes(16).toString("hex");
  
//     // Hash the password using the salt
//     const hash = crypto
//       .pbkdf2Sync(password, salt, 1000, 64, "sha512")
//       .toString("hex");
  
//     // Create a user object with the hashed password and salt
//     const user = {
//       username,
//       email,
//       password: hash,
//       salt,
//     };
  
//     try {
//       // Insert the user object into the "users" collection
//       await usersCollection.insertOne(user);
  
//       // Send a success response
//       res.send({ message: "User created successfully" });
//     } catch (error) {
//       // Handle any errors that occur during the database operation
//       console.error("Error creating user:", error);
//       res.status(500).send({ error: "An error occurred while creating the user" });
//     }
//   });
// Xem thử user đã tồn tại trong tài khoản hay chưa?
  app.get("/user",cors(),async (req,res)=>{
    const result = await usersCollection.find({}).toArray();
    res.send(result)
    }
    )
  
// app.post("/login",cors(),async(req,res)=>{
//     username = req.body.username
//     password = req.body.password

//     var crypto = require('crypto');

//     usersCollection = database.collection("users")
//     user = await usersCollection.findOne({username:username})
//     if(user==null)
//         res.send({"username":username,"message":"not exist"})
//     else
//     {
//         hash = crypto.pbkdf2Sync(password, user.salt,1000,64,`sha512`).toString(`hex`);
//         if(user.password==hash)
//             res.send(user)
//         else
//         res.send({"username":username,"password":password,"message":"wrong password"})
//     }
// })
// app.post("/signup", cors(), async (req, res) => {
//     const { username, email, password } = req.body;
  
//     // Kiểm tra xem người dùng đã tồn tại hay chưa
//     const existingUser = await usersCollection.findOne({ username });
//     if (existingUser) {
//       return res.send({ message: "Người dùng đã tồn tại" });
//     }
  
//     // Tạo mới người dùng
//     const salt = crypto.randomBytes(16).toString('hex');
//     const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
//     const newUser = {
//       username,
//       email,
//       password: hash,
//       salt
//     };
  
//     // Lưu thông tin người dùng vào collection
//     await usersCollection.insertOne(newUser);
//     // Lưu thông tin vào cơ sở dữ liệu
//     // await userCollection.insertOne({
//     //   username: username,
//     //   email: email,
//     //   password: hash,
//     //   salt: salt
//     // });
//     res.send(newUser);
//   });

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

    