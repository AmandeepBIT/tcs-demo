// Creating the instance from express, so we can fetch it methods for routing purpose
const express = require("express");

// Creating the Router instance from express, so we can manage the routing as per request
const router = express.Router();

// Creating the instance to get the available online servers
const { getOnlineServer } = require("../controllers/server.controller");

// *********************** GET METHODs STARTS *********************//

router.get("/", getOnlineServer);

// *********************** GET METHODs ENDS *********************//

module.exports = router;
