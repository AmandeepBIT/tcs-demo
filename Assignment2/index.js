// Creating the instance from express, so we can fetch it methods
const express = require("express");

// Creating the app instance from express, so we can use app in-built methods
const app = express();
app.use(express.json());

// import the env things so we can fetch the .env vaiables
require("dotenv").config();

// Defining the port where this server listen
const port = process.env.PORT || 3000;

/* TEST SERVER IS RUNNING */
app.get("/", (req, res, next) => {
  res.send("SERVER WORKING");
});

/* Routers */
const wheatherRoutes = require("./server/routes/wheater.router");
app.use("/api", wheatherRoutes);

// configure the server port and app will be host over the give port
app.listen(port, () => console.log(`Wheather Express server listening on port ${port}`));

module.exports = app;
