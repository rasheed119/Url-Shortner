const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Shorturl = require("./models/shortUrl");

const app = express();

app.set("view engine","ejs");
app.use(express.urlencoded({ extended : false }))

dotenv.config()

mongoose.connect("mongodb://127.0.0.1:27017/urlshortner",{
    useNewUrlParser:true,useUnifiedTopology: true
});

app.get("/",async (req,res)=>{
    const shorturls = await Shorturl.find();
    res.render("index",{shortUrls : shorturls})
})

app.post("/shortUrls",async (req,res)=>{
    await Shorturl.create({full : req.body.fullUrl});
    res.redirect("/");
})

app.get("/:shorturl",async(req,res)=>{
    const shorturl = await Shorturl.findOne({ short:req.params.shorturl });

    if(shorturl == null) return res.sendStatus(404);

    shorturl.clicks++;
    shorturl.save();

    res.redirect(shorturl.full)
})

app.listen(process.env.PORT,()=>console.log(`Server Started at localhost:${process.env.PORT}`));