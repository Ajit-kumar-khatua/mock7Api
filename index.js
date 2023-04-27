
const express=require("express")
const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const { connection }= require("./config/db")
const { userRouter } = require("./Routes/user.route")
const { UserModel }= require("./Models/user.model")
const { uuid }=require("uuidv4")
require("dotenv").config()
const cors=require("cors")
const passport2 = require("passport");
var GitHubStrategy = require("passport-github2").Strategy;


const app=express()
app.use(express.json())
app.use(cors())
app.use("/user",userRouter)

app.get("/",(req,res)=>{
    res.send("Home Route")
})

passport2.use(
    new GitHubStrategy(
      {
        clientID: process.env.clientId,
        clientSecret: process.env.clientSecret,
        callbackURL: "http://localhost:8080/auth/github/callback",
        scope: "user:email",
      },
      async function (accessToken, refreshToken, profile, done) {
        // console.log(profile);
        let name = profile.displayName;
        let image= profile._json.avatar_url
        let bio= profile._json.bio
        let phone= 8018269536
        let email = profile.emails[0].value;
        
        let user;
        try {
          user = await UserModel.findOne({ email });
          if (user) {
            return done(null, user);
          }
          user = new UserModel({
           name,
           image,
           bio,
           phone,
            email,
            password: uuid(),
          });
          await user.save();
          return done(null, user);
        } catch (error) {
          console.log(error);
        }
      }
    )
  );


  app.get(
    "/auth/github",
    passport2.authenticate("github", { scope: ["user:email"] })
  );
  
  app.get(
    "/auth/github/callback",
    passport2.authenticate("github", {
      failureRedirect: "/login",
      session: false,
    }),
    function (req, res) {
      // Successful authentication, redirect home.
      let user = req.user;
      var token = jwt.sign({ userID: user._id}, process.env.key);
    //   console.log(token);
      res.redirect(
        `http://127.0.0.1:5500/ajit_kumar_khatua_fw22_0167/unit-7/Mock/evaluation7/Frontend/details.html?&id=${token}}`
      );
    }
  );


app.listen(process.env.port,async ()=>{
    try {
        await connection
        console.log("connected to DB")
        
    } catch (error) {
        console.log(error)
    }
    console.log(`server is running on port ${process.env.port}`)
})