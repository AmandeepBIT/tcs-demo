require("dotenv").config();
module.exports = Object.freeze({
  CONFIG: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: 1433,
    trustServerCertificate: true
  },
  WHEATHER_API_BY_CITY: `${process.env.WHEATHER_API_BASEURL}/latest/by-city?city=`
});
