// Creating the instance from express, so we can fetch it methods
const express = require("express");

// Creating the app instance from express, so we can use app in-built methods
const app = express();
app.use(express.json());

// import the env things so we can fetch the .env vaiables
require("dotenv").config();

// Defining the port where this server listen
const port = process.env.PORT || 3001;

/* TEST SERVER IS RUNNING */
app.get("/", (req, res, next) => {
  res.send("SERVER STARTED");
});

/* Routers */
const serverRoutes = require("./server/routes/server.router");
app.use("/server", serverRoutes);

// configure the server port and app will be host over the give port
app.listen(port, () => console.log(`Express server listening on port ${port}`));

module.exports = app;
