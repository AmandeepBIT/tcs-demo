const express = require("express");
const app = express();
app.use(express.json());

require("dotenv").config();

const port = process.env.PORT || 3000;

/* TEST SERVER IS RUNNING */
app.get("/", (req, res, next) => {
    res.send("SERVER WORKING");
});

/* Routers */
const wheatherRoutes = require("./server/routes/wheater.router");
app.use("/api", wheatherRoutes);

//configure the server port
app.listen(port, () => console.log(`Wheather Express server listening on port ${port}`));

module.exports = app;
