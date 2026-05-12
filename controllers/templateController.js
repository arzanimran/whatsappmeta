const getProvider = require("../services/whatsappProvider");

async function sendTemplate(req, res) {

  try {

    const {
      patientName,
      doctorName,
      appointmentDate,
      hospitalName,
      patientPhone,
      templateType
    } = req.body;


    if (
      !patientName ||
      !doctorName ||
      !appointmentDate ||
      !hospitalName ||
      !patientPhone ||
      !templateType
    ) {

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }


    const provider = getProvider();

    let response =
      await provider.sendTemplateMessage(req.body);


    // if curent provider fails, switch to the other provider and retry
    if (!response.success) {

      console.log("PRIMARY PROVIDER FAILED");

      process.env.WHATSAPP_PROVIDER =
        process.env.WHATSAPP_PROVIDER === "META_WHATSAPP"
          ? "MESSAGE_BIRD"
          : "META_WHATSAPP";

      const fallbackProvider = getProvider();

      response =
        await fallbackProvider.sendTemplateMessage(req.body);

      response.fallbackUsed = true;
    }


    res.json(response);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
}

module.exports = {
  sendTemplate
};