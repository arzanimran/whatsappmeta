

//This is like a message tracking system inside your backend SENT DELEVERED FAILED

const templateLogs = new Map(); // map like a temp memory it is not permement it will delete after server restart

function saveTemplateLog(messageId, data) {// save message in memory

  templateLogs.set(messageId, data);
}

function updateTemplateStatus(messageId, status) { // update status of message in memory

  const existing = templateLogs.get(messageId);

  if (!existing) {
    return null;
  }

  existing.status = status;

  templateLogs.set(messageId, existing);//It replaces old value with new value

  return existing;
}

function getTemplateLog(messageId) {// get message log by messageId

  return templateLogs.get(messageId);
}

function getAllTemplateLogs() {

  return Array.from(templateLogs.values());
}

module.exports = {
  saveTemplateLog,
  updateTemplateStatus,
  getTemplateLog,
  getAllTemplateLogs
};