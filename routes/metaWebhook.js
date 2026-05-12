const express = require("express");

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