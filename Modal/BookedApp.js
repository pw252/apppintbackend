// models/Person.js
const mongoose = require("mongoose");

const bookedApp = new mongoose.Schema({
    person: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
    appointments: [
      {
        date: { type: String, required: true },
        time: { type: String, required: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
      },
    ],
});

const Booked = mongoose.model("Booked", bookedApp);

module.exports = Booked;
