const express = require("express");
const app = express();
app.use(express.json());

require("dotenv").config();

const port = process.env.PORT || 3001;

/* TEST SERVER IS RUNNING */
app.get("/", (req, res, next) => {
  res.send("SERVER STARTED");
});

/* Routers */
const serverRoutes = require("./server/routes/server.router");
app.use("/server", serverRoutes);

// configure the server port
app.listen(port, () => console.log(`Express server listening on port ${port}`));

module.exports = app;
