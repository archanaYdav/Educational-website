// these are some imports
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from 'express-session';
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

//THESE ARE FOR SETUP OF THE WEBSITE
const port = 3000;
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

//express session setup
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_CONNECT_URI);
const userSchema = new mongoose.Schema({
    email: String,
    password:String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

//this is to tell that we want to use the local strategy i.e username and password waasli
passport.use(User.createStrategy());

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id).exec()
        .then(user => done(null, user))
        .catch(err => done(err));
});


app.get("/", (req, res)=>{
    res.render("main.ejs");
});

app.get("/register", (req, res)=>{
    res.render("register.ejs");
});

app.get("/login", (req, res)=>{
    res.render("login.ejs");
});

app.get("/getStart", (req, res)=>{
    if(req.isAuthenticated()){
        res.render("getStart.ejs");
    }else{
        res.redirect("/login");
    }
});

app.get("/learn", (req, res)=>{
    if(req.isAuthenticated()){
        res.render("learn.ejs");
    }else{
        res.redirect("/login");
    }
});

app.get("/buy", (req, res)=>{
    if(req.isAuthenticated()){
        res.render("buy.ejs");
    }else{
        res.redirect("/login");
    }
});

app.post("/register", async(req, res)=>{
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/");
            });
        }
    });
});


app.post("/login", async(req, res)=>{

    const user = new User({
        email: req.body.username,
        password: req.body.password
    });

    req.login(user, function(error){
        if(error){
            console.log(error);
            res.redirect("/login");
        }
        else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        }
    });
});

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});













//i used this when i was setting up for the first time and it will not use any thing just simpler saving password
// app.post("/register", async(req, res)=>{
    
//     const user = new User({
//         email: req.body.username,
//         password: req.body.password
//     });
//     try{
//         await user.save();
//         res.redirect("/");
//     }catch(err){
//         console.log(err);
//     }
// });
