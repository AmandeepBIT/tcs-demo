const express = require("express");
const router = express.Router();
const { getOnlineServer } = require("../controllers/server.controller");

router.get("/", getOnlineServer);

module.exports = router;
