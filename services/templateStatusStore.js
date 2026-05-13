/*const templateLogs = [];

function saveTemplateLog(data) {
  templateLogs.push(data);
}

function getTemplateLogs() {
  return templateLogs;
}

module.exports = {
  saveTemplateLog,
  getTemplateLogs
};
*/

const templateLogs = new Map();

function saveTemplateLog(messageId, data) {

  templateLogs.set(messageId, data);
}

function updateTemplateStatus(messageId, status) {

  const existing = templateLogs.get(messageId);

  if (!existing) {
    return null;
  }

  existing.status = status;

  templateLogs.set(messageId, existing);

  return existing;
}

function getTemplateLog(messageId) {

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