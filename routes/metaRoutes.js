//Fake Meta signup/connect system.business wants to connect WhatsApp with your app
const express = require("express");

const router = express.Router();

const metaService = require("../services/metaWhatsAppService");

router.post("/embedded-signup", async (req, res) => {
  try {
    const result = await metaService.embeddedSignup(req.body);

    res.json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

module.exports = router;