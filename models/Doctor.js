const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({

  doctorName: {
    type: String,
    required: true
  },

  specialization: {
    type: String,
    required: true
  },

  availableTimings: [String],

  breakTimings: [String],

  slotDuration: {
    type: Number,
    default: 30
  },

  dailyBookingLimit: {
    type: Number,
    default: 5
  }

});

module.exports = mongoose.model("Doctor", doctorSchema);