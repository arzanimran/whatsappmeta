function validateMessage(req, res, next) {
  const { message, patientPhone } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      success: false,
      message: "Valid message is required"
    });
  }

  if (!patientPhone || !/^\d{10}$/.test(patientPhone)) {
    return res.status(400).json({
      success: false,
      message: "Valid 10 digit patientPhone is required"
    });
  }

  next();
}

module.exports = validateMessage;