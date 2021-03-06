require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us2.api.mailchimp.com/3.0/lists/0faafbf228";

  const options = {
    method: "POST",
    auth: process.env.USERID
  };

  const request = https.request(url, options, function(response) {
    response.on("data", function(data){
      console.log(response.statusCode);
      if(response.statusCode == 200) {
        res.sendFile(__dirname + "/success.html");
      }
      else {
        res.sendFile(__dirname + "/failure.html");
      }
    })
  })

  request.write(jsonData);
  request.end();


})

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("server running on port 3000");
})
