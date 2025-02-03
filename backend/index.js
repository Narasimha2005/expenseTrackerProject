const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json())

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  firstname:String,
  lastname:String,
  email:String,
  password:String,
  transactions:Array,
},{timestamps:true})

const User = mongoose.model("User",userSchema)
const dbUrl = 'mongodb+srv://narasimha19042005:narasimha19042005@cluster0.6bi1t.mongodb.net/users'

const intializeServerAndDb = async () => {
  try {
    await mongoose.connect(dbUrl)
    app.listen(3000, () => {
      console.log('Server is runnning at localhost:3000')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
intializeServerAndDb()

const authenticateToken = async (request,response,next)=>{
  let jwtToken;
  const Header = request.headers["authorization"]
  //console.log(Header)
  if(Header!==undefined){
    jwtToken=Header.split(" ")[1]
  }
  if(jwtToken===undefined){
    response.status(401)
    response.send("Invalid Jwt Token")
  }else{
    jwt.verify(jwtToken,"secret_key",async (error,payload)=>{
      if(error){
        response.status(401)
        response.send("Invalid Jwt Token")
      }else{
        request.userId=payload.userId
        next()
      }
    })
  }
}

app.get("/",authenticateToken,async (request,response)=>{
  const loggeduser = await User.findOne({_id:request.userId});
  response.send(loggeduser)
})

app.post("/register",async (request,response)=>{
  const {firstname,lastname,email,password} = request.body
  const hashedpassword = await bcrypt.hash(password,10)
  
  const dbUser = await User.findOne({email})

  if(dbUser===null){
    const result = await User.create(
      {
        firstname,
        lastname,
        email,
        password:hashedpassword,
        transactions:[]
      }
    )
    const newUserId = result._id
    response.send(`Created new user with ${newUserId}`)
  }else{
    response.status(400)
    response.send("User already exists")
  }
})

app.post("/login",async (request,response)=>{
  const {email,password} = request.body
  
  const dbUser = await User.findOne({email})

  if(dbUser===null){
    response.status(400)
    response.send("User doesn't exists")
  }else{
    const passwordMatched = await bcrypt.compare(password,dbUser.password)
    if(passwordMatched===true){
      const name = `${dbUser.firstname} ${dbUser.lastname}`
      const payload={
        userId:dbUser._id,
        name:name
      }
      const jwt_token =jwt.sign(payload,"secret_key")
      response.send({jwt_token})
    }else{
      response.status(401)
      response.send("Invalid Password")
    }
  }
})

app.post("/update-transaction",authenticateToken,async (request,response)=>{
  const newList = request.body
  const dbUser = await User.findOne({_id:request.userId})
  if (!dbUser) {
    return response.status(404).send("User not found");
  }
  const result =await User.updateOne({_id:request.userId},{$set:{transactions:newList}})
})
