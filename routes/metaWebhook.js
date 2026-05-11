const express = require("express");

const router = express.Router();

router.get("/webhook", (req, res) => {
  console.log("WEBHOOK VERIFIED");

  res.status(200).send("Webhook verified");
});

router.post("/webhook", (req, res) => {
  console.log("META WEBHOOK RECEIVED");

  console.log(req.body);

  res.json({
    success: true,
    received: true,
    data: req.body
  });
});

module.exports = router;