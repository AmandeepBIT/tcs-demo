const express = require("express");
const app = express();
app.use(express.json());

require("dotenv").config();

const port = process.env.PORT || 3004;

/* TEST SERVER IS RUNNING */
app.get("/", (req, res, next) => {
  res.send("SERVER STARTED");
  // res.sendFile(__dirname + '/Html/index.html');
});

/* Routers */
const userRoutes = require("./server/routes/user.router");
app.use("/user", userRoutes);

// configure the server port
app.listen(port, () => console.log(`Express server listening on port ${port}`));

module.exports = app;
