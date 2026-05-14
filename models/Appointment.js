const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

  patientName: String,

  patientPhone: String,

  doctorName: String,

  specialization: String,

  slot: String,

  appointmentDate: String,

  status: {
    type: String,
    default: "BOOKED"
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Appointment", appointmentSchema);