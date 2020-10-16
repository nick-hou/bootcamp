const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fruitsDB', {useNewUrlParser: true, useUnifiedTopology: true});

const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be specified"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  review: String
});

const Fruit = mongoose.model('Fruit', fruitSchema)

const fruit = new Fruit({
  name: "peach",
  rating: 10,
  review: "Best fruit ever"
 });

// fruit.save();

const Person = mongoose.model('Person', {
  name: String,
  age: Number,
  favoriteFruit: fruitSchema
});

const mango = new Fruit({
  name: "Mango",
  score: 6,
  review: "Okay"
})

// mango.save();

// const person = new Person({
//   name: "Cris",
//   age: 27,
//   favoriteFruit: pineapple
// });

// person.save();

Person.updateOne({name: "Nick"}, {favoriteFruit: mango}, function(err) {
  if(err) {console.log(err);}
  else {console.log("Success");}
});

// // Fruit.insertMany([kiwi, orange], function(err) {
// //   if(err) {console.log(err);}
// //   else {console.log("Success");}
// // });

Fruit.find(function(err, fruits) {
  if(err) {console.log(err);}
  else {
    fruits.forEach(function(element) {
      console.log(element.name);
    })
    mongoose.connection.close();
  }
});

//
// Fruit.deleteOne(
//   {
//     name: "Apple"
//   },
//   function(err) {
//     if(err) {console.log(err);}
//     else {console.log("Success");}
//   }
// );
