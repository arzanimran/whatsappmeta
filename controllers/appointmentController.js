const whatsappService = require("../services/whatsappProvider");

async function bookAppointment(req, res) {

  try {

    const {
      patientName,
      patientPhone
    } = req.body;

    console.log("BOOKING APPOINTMENT");

    const messageResponse =
      await whatsappService.sendAppointmentMessage(
        patientPhone,
        `Hello ${patientName}, your appointment is booked successfully`
      );

    res.json({
      success: true,
      appointment: {
        patientName,
        patientPhone
      },
      whatsapp: messageResponse
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
}

module.exports = {
  bookAppointment
};