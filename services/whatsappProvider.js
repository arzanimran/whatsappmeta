const metaWhatsAppService = require("./metaWhatsAppService");
const messageBirdService = require("./messageBirdService");

function getProvider() {

  const provider = process.env.WHATSAPP_PROVIDER;

  if (provider === "META_WHATSAPP") {
    return metaWhatsAppService;
  }

  return messageBirdService;
}

module.exports = getProvider;