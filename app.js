//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser:true , useUnifiedTopology: true});

const Schema = mongoose.Schema;
const blogSchema = new Schema({
  title: String, 
  post: String
});

const Blog = mongoose.model("Blog", blogSchema);
// const defaultValue = new Blog({title:'test', post:"lorem ipsum"});
// defaultValue.save();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  Blog.find({},(err, docs)=>{
    res.render('home', {post: docs} );
  });
});

app.get("/contact", (req, res) => {
  res.render('contact', {contactContent : contactContent});
});


app.get("/about", (req, res) => {
  res.render('about', {aboutContent : aboutContent});
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get('/post/:postTitle', (req, res)=> {
  Blog.find({}, (err, docs) => {
    docs.forEach(value => {
      // console.log(_.lowerCase(req.params.postTitle))
      if(_.lowerCase(req.params.postTitle) === _.lowerCase(value.title)) {
        console.log("hi there");
        res.render('post',{post : value});        
      }
    }); 
  });
});

app.post("/publish", (req, res) => {
  let title = req.body.title;
  let post = req.body.post;
  let newPost = new Blog({ title: title, post: post});
  newPost.save();
  res.redirect("/");
});


app.get("/delete/:postID", (req, res) =>{
  // console.log("del");
  Blog.findByIdAndDelete(req.params.postID, (callback) =>{
   res.redirect("/");
  });
});













app.listen(3000, function() {
  console.log("Server started on port 3000");
});
