// importing the axios to perform some HTTP based calls
const axios = require("axios");
const constants = require("../utility/wheather.constant");
require("dotenv").config();

// Pre-Settings for the axios headers. Like API Security Key and authentication key
axios.interceptors.request.use(
  (config) => {
    config.headers[
      "x-api-key"
    ] = process.env.WHEATHER_API_KEY;
    config.headers["Content-type"] = "application/json";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Call third party APIs for latest wheather details based on the city
const callWheatherAPI = async (cityName) => {
  try {
    const url = constants.WHEATHER_API_BY_CITY + cityName;
    const serverResult = await axios.get(url);
    if (
      serverResult &&
      serverResult.data &&
      serverResult.data.stations &&
      serverResult.data.stations.length > 0
    ) {
      return serverResult.data.stations[0] || {};
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
};

module.exports = {
  callWheatherAPI
};
