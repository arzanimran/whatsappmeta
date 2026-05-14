const express = require("express");

const router = express.Router();

const {
  handleMessage
} = require("../controllers/chatbotController");

router.post("/bot/message", handleMessage);

module.exports = router;