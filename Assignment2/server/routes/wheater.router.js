const express = require("express");
const router = express.Router();
const { getWheather } = require("../controllers/wheather.controller");

router.get("/bycity", getWheather);

module.exports = router;
