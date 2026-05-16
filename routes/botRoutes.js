/*const express = require("express");

const router = express.Router();

const {
  handleMessage
} = require("../controllers/chatbotController");

router.post("/bot/message", handleMessage);

module.exports = router;
*/

const express = require("express");

const router = express.Router();

const {
  handleMessage
} = require("../controllers/chatbotController");

const validateMessage =
  require("../middleware/validateMessage");

router.post(
  "/bot/message",
  validateMessage,
  handleMessage
);

module.exports = router;