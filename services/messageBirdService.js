const {
  saveTemplateLog
} = require("./templateStatusStore");

async function sendTemplateMessage(data) {

console.log("MESSAGEBIRD TEMPLATE MESSAGE");

  const {
    patientName,
    doctorName,
    appointmentDate,
    hospitalName,
    patientPhone,
    templateType,
    simulateFailure
  } = data;

  if (simulateFailure) { // if simulateFailure is true, simulate a failure response from MessageBird

    return {
      success: false,
      provider: "MESSAGE_BIRD",
      status: "FAILED",
      message: "MessageBird send failed"
    };
  }

  let message = "";

  if (templateType === "confirmation") {

    message =
      `Hello ${patientName}, your appointment with Dr.${doctorName} is confirmed on ${appointmentDate} at ${hospitalName}`;
  }

  else if (templateType === "reminder") {

    message =
      `Reminder: Appointment with Dr.${doctorName} on ${appointmentDate} at ${hospitalName}`;
  }

  else if (templateType === "cancellation") {

    message =
      `Appointment with Dr.${doctorName} on ${appointmentDate} at ${hospitalName} has been cancelled`;
  }

  const response = {
    success: true,
    provider: "MESSAGE_BIRD",
    to: patientPhone,
    templateType,
    message,
    messageId: "messagebird_template_001",
    status: "SENT"
  };

  saveTemplateLog(response);

  return response;
}

module.exports = {
  sendTemplateMessage
};