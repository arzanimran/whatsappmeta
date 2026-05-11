const provider = process.env.WHATSAPP_PROVIDER;

const metaWhatsAppService = require("./metaWhatsAppService");
const messageBirdService = require("./messageBirdService");

function getProvider() {
  if (provider === "META_WHATSAPP") {
    return metaWhatsAppService;
  }

  return messageBirdService;
}

module.exports = getProvider();