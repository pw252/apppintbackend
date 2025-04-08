const mongoose = require("mongoose");

const personSlot = new mongoose.Schema({
  person: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
  slots: { type: Map, of: [String], required: true } // Stores slots as { [day]: [slot1, slot2, ...] }
});

const Slots = mongoose.model("Slot", personSlot);

module.exports = Slots;
