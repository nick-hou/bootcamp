require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {

  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const units = "imperial"
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + units + "&appid=" + apiKey;
  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const weatherIcon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
      res.write("<p>The weather in " + query + " is currently " + weatherDescription + ".</p>");
      res.write("<p>The temperature is " +  temp + " degrees fahrenheit</p>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    })
  })
})

app.listen(3000, function() {
  console.log("Server is running on port 3000");
})
