// This service checks if a specific time slot is available for booking an appointment with a doctor on a given date.

const Appointment = require("../models/Appointment");

async function checkSlotAvailability(doctorName, appointmentDate, slot) {//Search database if THIS doctor already has an appointment at this time
  const existing = await Appointment.findOne({
    doctorName,
    appointmentDate,
    slot,
    status: "BOOKED"
  });

  return !existing; // true = available
}

module.exports = { checkSlotAvailability };