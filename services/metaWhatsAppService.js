async function embeddedSignup(data) {
  console.log("META EMBEDDED SIGNUP STARTED");

  return {
    success: true,
    provider: "META_WHATSAPP",
    businessId: "mock_business_123",
    phoneNumberId: "mock_phone_456",
    accessToken: "mock_access_token_abc",
    businessName: data.businessName,
    status: "ONBOARDED"
  };
}

async function sendAppointmentMessage(phone, message) {
  console.log("META MESSAGE SENT");

  return {
    success: true,
    provider: "META_WHATSAPP",
    to: phone,
    message,
    messageId: "meta_mock_msg_001"
  };
}

module.exports = {
  embeddedSignup,
  sendAppointmentMessage
};