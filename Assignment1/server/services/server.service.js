/* eslint-disable prefer-promise-reject-errors */
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { StatusCodes } = require("http-status-codes");

/**
 * This function will point out to local json file and will get the list of all servers
 * @returns will throw the Promise as per online/offline servers
 */
const findServer = async () => {
  try {
    // Start reading the content from the local file
    const userMockData = fs.readFileSync(getServerListFilePath());

    // Start parsing the content of file
    const serverMockData = isDataExits(userMockData);
    if (!serverMockData) {
      return Promise.reject({ status: StatusCodes.NOT_FOUND, message: "Server List Empty" });
    }

    // This method will check wheather the available servers are online or not
    let serverArray = await getServerList(serverMockData);

    // Sort the servers as per priority. We need to find the lowestest prority based server first
    serverArray = sortArray(serverArray);
    return serverArray.length
      ? Promise.resolve(serverArray[0])
      : Promise.reject({ status: StatusCodes.NOT_FOUND, message: "No online server found" });
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * This function will accept the all ther available servers
 * Afther that will check online existance of available servers
 * Server response should be between 200 - 300
 * */
async function getServerList (serverMockData) {
  const serverArray = [];
  for (let index = 0; index < serverMockData.length; index++) {
    const server = serverMockData[index];
    try {
      // Check one by one online existance of each server
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

// Sort the all available servers based on priority. Lowest priority should be on the top
function sortArray (arr) {
  return arr.sort((a, b) => a.priority > b.priority ? 1 : b.priority > a.priority ? -1 : 0);
}

// If JSON file have the data then we need to parse it. First time file will be empty and no need to parse it
function isDataExits (userMockData) {
  if (userMockData && userMockData.length > 0) {
    userMockData = JSON.parse(userMockData);
    return userMockData;
  }
  return undefined;
}

// Get the path of local JSON. In which all the available servers listed
const getServerListFilePath = () => {
  return path.resolve(__dirname, "../assets/mockServer.json");
};

module.exports = {
  findServer, isDataExits, sortArray, getServerList
};
