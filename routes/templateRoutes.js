const express = require("express");

const router = express.Router();

const {
  sendTemplate
} = require("../controllers/templateController");


router.post("/template/send", sendTemplate);

module.exports = router;