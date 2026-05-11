async function sendAppointmentMessage(phone, message) {
  console.log("MESSAGEBIRD MESSAGE SENT");

  return {
    success: true,
    provider: "MESSAGE_BIRD",
    to: phone,
    message
  };
}

module.exports = {
  sendAppointmentMessage
};