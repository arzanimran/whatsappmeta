/*
const {
  saveTemplateLog
} = require("./templateStatusStore");

const generateMessageId =
  require("../utils/generateMessageId");

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

  if (simulateFailure) {

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

  else {

    message =
      `Appointment with Dr.${doctorName} on ${appointmentDate} at ${hospitalName} has been cancelled`;
  }

  const messageId =
    generateMessageId("messagebird");

  const response = {
    success: true,
    provider: "MESSAGE_BIRD",
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
  sendTemplateMessage
};

*/

const {
  saveTemplateLog
} = require("./templateStatusStore");

const generateMessageId =
  require("../utils/generateMessageId");

const buildTemplateMessage =
  require("../utils/buildTemplateMessage");


// SEND TEMPLATE MESSAGE
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


  // VALIDATION
  if (
    !patientName ||
    !doctorName ||
    !appointmentDate ||
    !hospitalName ||
    !patientPhone ||
    !templateType
  ) {

    return {
      success: false,
      provider: "MESSAGE_BIRD",
      status: "FAILED",
      message: "All fields are required"
    };
  }


  // FAILURE SIMULATION
  if (simulateFailure) {

    return {
      success: false,
      provider: "MESSAGE_BIRD",
      status: "FAILED",
      message: "MessageBird send failed"
    };
  }


  // REUSABLE TEMPLATE BUILDER
  const message =
    buildTemplateMessage(data);


  // UNIQUE MESSAGE ID
  const messageId =
    generateMessageId("messagebird");


  // FINAL RESPONSE
  const response = {
    success: true,
    provider: "MESSAGE_BIRD",
    to: patientPhone,
    templateType,
    message,
    messageId,
    status: "SENT",
    createdAt: new Date()
  };


  // SAVE MESSAGE LOG
  saveTemplateLog(messageId, response);

  return response;
}


module.exports = {
  sendTemplateMessage
};