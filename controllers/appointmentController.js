const getProvider = require("../services/whatsappProvider");

async function bookAppointment(req, res) {

  try {

    const {
      patientName,
      patientPhone,
      doctorName,
      appointmentDate,
      hospitalName
    } = req.body;

    if (
      !patientName ||
      !patientPhone ||
      !doctorName ||
      !appointmentDate ||
      !hospitalName
    ) {

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    console.log("BOOKING APPOINTMENT");

    // fake appointment object
    const appointment = {
      appointmentId: Date.now(),
      patientName,
      patientPhone,
      doctorName,
      appointmentDate,
      hospitalName,
      status: "BOOKED"
    };

    // provider resolve
    const provider = getProvider(
      process.env.WHATSAPP_PROVIDER
    );

    // template auto send after booking
    const templateResponse =
      await provider.sendTemplateMessage({
        patientName,
        doctorName,
        appointmentDate,
        hospitalName,
        patientPhone,
        templateType: "confirmation"
      });

    res.json({
      success: true,
      appointment,
      whatsappNotification: templateResponse
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