/*const {
  saveTemplateLog
} = require("./templateStatusStore");

async function embeddedSignup(data) {

  console.log("META EMBEDDED SIGNUP STARTED");

  if (data.simulateFailure) {

    return {
      success: false,
      step: "signup",
      message: "Meta signup failed"
    };
  }

  return {
    success: true,
    provider: "META_WHATSAPP",

    businessId: "mock_business_123",

    phoneNumberId: "mock_phone_456",

    businessName: data.businessName,

    onboardingSteps: [
      {
        step: "business_signup",
        status: "completed"
      },
      {
        step: "callback_received",
        status: "completed"
      },
      {
        step: "token_generated",
        accessToken: "mock_access_token_abc"
      },
      {
        step: "webhook_subscribed",
        webhook: "/meta/webhook"
      }
    ],

    status: "ONBOARDED"
  };
}


async function sendTemplateMessage(data) {

  console.log("META TEMPLATE MESSAGE");

  const {
    patientName,
    doctorName,
    appointmentDate,
    hospitalName,
    patientPhone,
    templateType,
    simulateFailure
  } = data;

  if (simulateFailure) {

    return {
      success: false,
      provider: "META_WHATSAPP",
      status: "FAILED",
      message: "Template sending failed"
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
    provider: "META_WHATSAPP",
    to: patientPhone,
    templateType,
    message,
    messageId: "meta_template_001",
    status: "SENT"
  };

  saveTemplateLog(response);

  return response;
}


module.exports = {
  embeddedSignup,
  sendTemplateMessage
};
*/

const {
  saveTemplateLog
} = require("./templateStatusStore");

const generateMessageId =
  require("./utils/generateMessageId");

async function embeddedSignup(data) {

  console.log("META EMBEDDED SIGNUP STARTED");

  if (data.simulateFailure) {

    return {
      success: false,
      step: "signup",
      message: "Meta signup failed"
    };
  }

  return {
    success: true,
    provider: "META_WHATSAPP",

    businessId: "mock_business_123",

    phoneNumberId: "mock_phone_456",

    businessName: data.businessName,

    onboardingSteps: [
      {
        step: "business_signup",
        status: "completed"
      },
      {
        step: "callback_received",
        status: "completed"
      },
      {
        step: "token_generated",
        accessToken: "mock_access_token_abc"
      },
      {
        step: "webhook_subscribed",
        webhook: "/meta/webhook"
      }
    ],

    status: "ONBOARDED"
  };
}

async function sendTemplateMessage(data) {

  console.log("META TEMPLATE MESSAGE");

  const {
    patientName,
    doctorName,
    appointmentDate,
    hospitalName,
    patientPhone,
    templateType,
    simulateFailure
  } = data;

  if (simulateFailure) {

    return {
      success: false,
      provider: "META_WHATSAPP",
      status: "FAILED",
      message: "Meta template send failed"
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

  else {

    message =
      `Appointment with Dr.${doctorName} on ${appointmentDate} at ${hospitalName} has been cancelled`;
  }

  const messageId =
    generateMessageId("meta");

  const response = {
    success: true,
    provider: "META_WHATSAPP",
    to: patientPhone,
    templateType,
    message,
    messageId,
    status: "SENT"
  };

  saveTemplateLog(messageId, response);

  return response;
}

module.exports = {
  embeddedSignup,
  sendTemplateMessage
};