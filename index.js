const express = require('express');
const app = express();
const port = 3000;
const morgan=require("morgan")
app.use(morgan("combined"))
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const bodyParser=require("body-parser")
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));

app.use(express.json({limit:'10mb '}))
app.use(express.urlencoded({limit:'10mb'}));
app.use(express.json());

const path = require("path")

const cors=require("cors");
const fileUpload = require("express-fileupload");
app.use(cors())
app.listen(port,()=>{
console.log(`My Server listening on port ${port}`)
})
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
usersCollection = database.collection("users");
productsCollection = database.collection("products");
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
    console.log(email, password)
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
      salt: salt,
    });

    res.send(req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send("Đã xảy ra lỗi trong quá trình đăng ký người dùng");
  }
  
});


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
// Get all product
app.get("/products", cors(), async (reg, res)=>{
  const result = await productsCollection.find({}).toArray();
  res.send(result)
  })
// Get Product theo id
app.get("/products/:id", cors(), async (req, res) => {
  var productId = req.params.id; // Không cần chuyển đổi thành string
  const result = await productsCollection.find({ productId: productId }).toArray();
  res.send(result[0]);
});

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

// contact + support
contactCollection = database.collection("Contact");
// đặt tên colection trong database là Contact
supportCollection = database.collection("Support");
// đặt tên colection trong database là Support

app.post("/supports=contacts", cors(), async(req,res)=>{
    await contactCollection.insertOne(req.body)
    res.send(req.body)
})

app.post("/supports", cors(), async(req,res)=>{
    await supportCollection.insertOne(req.body)
    res.send(req.body)
})


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
accountCollection = database.collection("Account");
    app.get("/accounts",cors(),async (req,res)=>{
        const result = await accountCollection.find({}).toArray();
        res.send(result)
        }
        )
      
app.get("/accounts/:id",cors(),async (req,res)=>{
        var o_id = req.params["id"];
        const result = await accountCollection.find({_id:o_id}).toArray();
        res.send(result[0])
        }
        )
        
app.post("/account",async(req,res)=>{
          var crypto = require('crypto');
          const salt = crypto.randomBytes(16).toString('hex');
      
           accountCollection = database.collection("Account");
           user= req.body
      
          const hash = crypto.pbkdf2Sync(user.password, salt, 1000, 64, `sha512`).toString(`hex`);
      
          user.password=hash
          user.salt=salt
          
          await accountCollection.insertOne(user)
          res.send(req.body)
      })
      
app.post("/login",cors(),async(req,res)=>{
        Email=req.body.Email
        password=req.body.password
        var crypto = require('crypto');
        accountCollection = database.collection("Account")
        // user= req.body
        user = await accountCollection.findOne({Email:Email})
        const salt = user.salt
        if(!user)
        res.send({"message":"not exist"})
        else
        {
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
        if(hash == user.password) 
        res.send(user)
        
        else
        res.send({"Email": Email, "password": password, "message":"wrong password"}
          )}
        })
      
      
app.put("/account", cors(), async (req, res) => {
        try {
          Email=req.body.Email
          // Check if the user exists
          accountCollection = database.collection("Account");
          user = await accountCollection.findOne({ Email: Email });
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
const router =  require('./routes')
app.use('/api/', router)

app.use('/static', express.static(path.join(__dirname, 'public')))    
