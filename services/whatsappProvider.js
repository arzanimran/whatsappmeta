
//this function selects and returns the correct WhatsApp messaging service "Meta or MessageBird"!
const metaWhatsAppService =
  require("./metaWhatsAppService");

const messageBirdService =
  require("./messageBirdService");

function getProvider(providerName) {

  if (providerName === "META_WHATSAPP") {
    return metaWhatsAppService;
  }

  return messageBirdService;
}

module.exports = getProvider;