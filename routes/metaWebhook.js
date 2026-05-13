/*const express = require("express");

const router = express.Router();

router.get("/webhook", (req, res) => {
//http://localhost:3000/meta/webhook?hub.mode=subscribe&hub.verify_token=my_verify_token&hub.challenge=12345

// this is for read the url params and verify the webhook

  const mode = req.query["hub.mode"];

  const token = req.query["hub.verify_token"];

  const challenge = req.query["hub.challenge"];

  const VERIFY_TOKEN = "my_verify_token";


  if (mode && token === VERIFY_TOKEN) {

    console.log("WEBHOOK VERIFIED");

    return res.status(200).send(challenge);
  }

  return res.status(403).send("Verification failed");
});



router.post("/webhook", (req, res) => {

  console.log("META WEBHOOK EVENT");

  console.log(req.body);

  res.json({
    success: true,
    webhookReceived: true,
    event: req.body
  });
});


module.exports = router;
*/

const express = require("express");

const router = express.Router();

const {
  updateTemplateStatus,
  getTemplateLog
} = require("../services/templateStatusStore");

router.get("/webhook", (req, res) => {

  const mode = req.query["hub.mode"];

  const token = req.query["hub.verify_token"];

  const challenge = req.query["hub.challenge"];

  const VERIFY_TOKEN = "my_verify_token";

  if (
    mode === "subscribe" &&
    token === VERIFY_TOKEN
  ) {

    console.log("WEBHOOK VERIFIED");

    return res.status(200).send(challenge);
  }

  return res.status(403).send("Verification failed");
});

router.post("/webhook", (req, res) => {

  const {
    messageId,
    status
  } = req.body;

  const updated =
    updateTemplateStatus(messageId, status);

  if (!updated) {

    return res.status(404).json({
      success: false,
      message: "Message not found"
    });
  }

  res.json({
    success: true,
    updated
  });
});

router.get("/message-status/:messageId", (req, res) => {

  const message =
    getTemplateLog(req.params.messageId);

  if (!message) {

    return res.status(404).json({
      success: false,
      message: "Message not found"
    });
  }

  res.json(message);
});

module.exports = router;