//this function creates a unique message ID for every WhatsApp message you send.
function generateMessageId(provider) {

  const random =
    Math.random().toString(36).substring(2, 10);

  return `${provider}_${Date.now()}_${random}`; // provider means where messg come from meta or meta_bride
}

module.exports = generateMessageId;