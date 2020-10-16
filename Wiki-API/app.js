//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
// const adminPW = process.env.ADMIN_PW;
// mongoose.connect("mongodb+srv://admin-nick:" + adminPW + "@cluster0.txtys.mongodb.net/wikiDB", {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: false
  }
});

const Article = mongoose.model("Article", articleSchema);

//All articles:

app.route("/articles")

.get(function(req, res) {
  Article.find(function(err, foundItems) {
    if(!err) {res.send(foundItems);}
    else {res.send(err);}
  })
})

.post(function(req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err) {
    if(!err) {res.send("Successfully saved article");}
    else {res.send(err);}
  });
})

.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if(!err) {res.send("Articles deleted");}
    else {res.send(err);}
  })
});


// Specific articles:

app.route("/articles/:articleName")

.get(function(req, res) {
  // requestedTitle = _.lowerCase(req.params.articleName);
  requestedTitle = req.params.articleName;
  Article.findOne({title: requestedTitle}, function(err, foundItem) {
    if(foundItem) {res.send(foundItem);}
    else {res.send("No articles with a matching title were found.");}
  });
})

.put(function(req, res) {
  Article.updateOne(
    {title: req.params.articleName},
    {title: req.body.title, content: req.body.content},
    {upsert: true},
    function(err, results) {
      if(!err) {res.send("Successfully updated article");}
    }
  );
})

.patch(function(req, res) {
  Article.updateOne(
    {title: req.params.articleName},
    {$set: req.body},
    function(err, results) {
      if(!err) {res.send("Successfully updated article");}
    }
  );
})

.delete(function(req, res) {
  Article.deleteOne(
    {title: req.params.articleName},
    function(err, results) {
      if(!err) {res.send("Successfully deleted article");}
    }
  );
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
