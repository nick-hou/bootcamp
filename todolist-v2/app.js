//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const password = process.env.ADMIN_PW;
const mongoURL = "mongodb+srv://admin-nick:" + password + "@cluster0.txtys.mongodb.net/todolistDB"
mongoose.connect(mongoURL, {useUnifiedTopology: true, useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Cook"
});
const item2 = new Item ({
  name: "Eat"
});
const item3 = new Item ({
  name: "Clean"
});

var items = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {
    if(foundItems.length == 0) {
      Item.insertMany(items, function(err) {
        if(err) {console.log(err);}
        else {console.log("Inserted default items");}
      });
      res.redirect("/");
    } else {
       res.render("list", {listTitle: "Today", newListItems: foundItems})
    }
  })
});

app.post("/", function(req, res) {

  const listName = req.body.list;
  const item = new Item({
    name: req.body.newItem
  });

  if(listName == "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: _.lowerCase(listName)}, function(err, foundList) {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      }
    )
  }

});

app.post("/delete", function(req, res) {

  const checkedItemID = req.body.checkbox;
  const checkedListID = req.body.listName;
  if(checkedListID == "Today") {
    Item.findByIdAndDelete(checkedItemID, function(err) {
      if(err) {console.log(err);}
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      {name: _.lowerCase(checkedListID)},
      {$pull: {items: {_id: checkedItemID}}},
      function(err, foundList) {
        res.redirect("/" + checkedListID);
      }
    );
  }


});

app.get("/:customList", function(req, res) {
  const customListName = _.lowerCase(req.params.customList);

  List.findOne({name: customListName}, function(err, foundList) {
    if(!foundList) {
      const list = new List({
        name: customListName,
        items: items
      });
      list.save();
      res.render("list", {listTitle: _.capitalize(customListName), newListItems: list.items});
    } else {
      res.render("list", {listTitle: _.capitalize(customListName), newListItems: foundList.items});
    }
  });
});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });
