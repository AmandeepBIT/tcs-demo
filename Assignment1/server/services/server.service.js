const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { StatusCodes } = require("http-status-codes");

const findServer = async () => {
  try {
    const userMockData = fs.readFileSync(getServerListFilePath());
    const serverMockData = isDataExits(userMockData);
    if (!serverMockData) {
      return Promise.reject(new Error({ status: StatusCodes.NOT_FOUND, message: "Server List Empty" }));
    }
    let serverArray = await getServerList(serverMockData);
    serverArray = sortArray(serverArray);
    return serverArray.length
      ? Promise.resolve(serverArray[0])
      : Promise.reject(new Error({ status: StatusCodes.NOT_FOUND, message: "No online server found" }));
  } catch (error) {
    return Promise.reject(error);
  }
};

async function getServerList (serverMockData) {
  const serverArray = [];
  for (let index = 0; index < serverMockData.length; index++) {
    const server = serverMockData[index];
    try {
      const serverResult = await axios.get(server.url, { timeout: 5000 });
      if (serverResult.status >= 200 && serverResult.status < 300) {
        serverArray.push(server);
      }
    } catch (error) {
      console.log("inside error", error.message);
    }
  }
  return serverArray;
}

function sortArray (arr) {
  return arr.sort((a, b) => a.priority > b.priority ? 1 : b.priority > a.priority ? -1 : 0);
}

function isDataExits (userMockData) {
  if (userMockData && userMockData.length > 0) {
    userMockData = JSON.parse(userMockData);
    return userMockData;
  }
  return undefined;
}

const getServerListFilePath = () => {
  return path.resolve(__dirname, "../assets/mockServer.json");
};

module.exports = {
  findServer, isDataExits, sortArray, getServerList
};
