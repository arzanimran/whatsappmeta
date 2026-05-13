function generateMessageId(provider) {

  const random =
    Math.random().toString(36).substring(2, 10);

  return `${provider}_${Date.now()}_${random}`;
}

module.exports = generateMessageId;