const express = require("express");

const router = express.Router();

const {
  bookAppointment
} = require("../controllers/appointmentController");

router.post("/appointment", bookAppointment);

module.exports = router;