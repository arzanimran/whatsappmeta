function buildTemplateMessage(data) {

  const {
    patientName,
    doctorName,
    appointmentDate,
    hospitalName,
    templateType
  } = data;


  if (templateType === "confirmation") {

    return `Hello ${patientName}, your appointment with Dr.${doctorName} is confirmed on ${appointmentDate} at ${hospitalName}`;
  }


  if (templateType === "reminder") {

    return `Reminder: Appointment with Dr.${doctorName} on ${appointmentDate} at ${hospitalName}`;
  }


  return `Appointment with Dr.${doctorName} on ${appointmentDate} at ${hospitalName} has been cancelled`;
}

module.exports = buildTemplateMessage;