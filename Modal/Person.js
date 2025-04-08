// models/Person.js
const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  about: { type: String,required: true },
  image: { type: String,required: true },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
