const getProvider = require("../services/whatsappProvider");

async function bookAppointment(req, res) {

  try {

    const {
      patientName,
      patientPhone
    } = req.body;

    // validation added to ensure required fields are present
    if (!patientName || !patientPhone) {
      return res.status(400).json({
        success: false,
        message: "patientName and patientPhone are required"
      });
    }

    console.log("BOOKING APPOINTMENT");

    const whatsappService = getProvider();

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