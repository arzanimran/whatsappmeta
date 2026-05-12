const templateLogs = [];

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