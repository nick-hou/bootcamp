const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const itemList = [
  "Buy food",
  "Make food",
  "Eat food"
];

const workList = [

];

app.get("/", function(req, res) {
  res.render("list", {listTitle: date.getDay(), itemList: itemList});
});

app.get("/work", function(req, res) {
  res.render("list", {listTitle: "Work List", itemList: workList})
})

app.get("/about", function(req, res) {
  res.render("about");
})

app.post("/", function(req, res) {
  if(req.body.list == "Work") {
    workList.push(req.body.newItem);
    res.redirect("/work");
  } else {
    itemList.push(req.body.newItem);
    res.redirect("/");
  }
});

// app.post("/work", function(req, res) {
//   workList.push(req.body.newItem);
//   res.redirect("/" + req.body.list);
// });

app.listen(3000, function() {

});
