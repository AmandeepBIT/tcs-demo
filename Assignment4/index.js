// Creating the instance from express, so we can fetch it methods
const express = require("express");

// Creating the app instance from express, so we can use app in-built methods
const app = express();
app.use(express.json());

// import the env things so we can fetch the .env vaiables
require("dotenv").config();

// Defining the port where this server listen
const port = process.env.PORT || 3004;

/* TEST SERVER IS RUNNING */
app.get("/", (req, res, next) => {
  res.send("SERVER STARTED");
  // res.sendFile(__dirname + '/Html/index.html');
});

/* Routers */
const userRoutes = require("./server/routes/user.router");
app.use("/user", userRoutes);

// configure the server port and app will be host over the give port
app.listen(port, () => console.log(`Express server listening on port ${port}`));

module.exports = app;
