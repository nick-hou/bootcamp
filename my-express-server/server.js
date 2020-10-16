const express = require("express");

const app = express();

app.get("/", function(req, res) {
  res.send("<h1>Hello</h1>");
});

app.get("/about", function(req, res) {
  res.send("Nicholas Hou");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
