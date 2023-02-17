// import thr fs and path modules to handle the opeartions regarding file
const fs = require("fs");
const path = require("path");
const { StatusCodes } = require("http-status-codes");

// Add User in JSON
const addUser = async (data) => {
  try {
    // Read the content of file
    let userMockData = readFile();

    // If data exists in file then need to parse it
    userMockData = isDataExits(userMockData);

    // Genrate user id as per previous records
    const id = (userMockData && userMockData.length > 0) ? userMockData?.length + 1 : 1;
    const record = { ...data, id };
    const updatedMockData = (userMockData && userMockData.length > 0) ? [...userMockData, record] : [record];

    // Write the file with new user
    writeFile(updatedMockData);
    return Promise.resolve(record);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Get all users from JSON file
const getAllUsers = async () => {
  try {
    // Read the content of file
    let userMockData = readFile();

    // If data exists in file then need to parse it
    userMockData = isDataExits(userMockData);
    return Promise.resolve(userMockData);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Get Indviual user from the JSON file based on the unique ID
const getUserById = async (id) => {
  try {
    // Read the content of file
    let userMockData = readFile();

    // If data exists in file then need to parse it
    userMockData = isDataExits(userMockData);
    const user = userMockData
      ? userMockData.find((user) => user.id === id)
      : undefined;
    return user
      ? Promise.resolve(user)
      : Promise.reject(new Error({
        status: StatusCodes.NOT_FOUND,
        message: "User Not Found"
      }));
  } catch (error) {
    // Handle error
    return Promise.reject(error);
  }
};

// Update the user as per request
const updateUser = async (id, data) => {
  try {
    // Read the content of file
    const userMockData = readFile();

    // If data exists in file then need to parse it
    const user = userMockData
      ? userMockData.find((user) => user.id === id)
      : undefined;
    if (!user) {
      return Promise.reject(new Error({
        status: StatusCodes.NOT_FOUND,
        message: "User Not Found"
      }));
    }

    // Get the exact user, so we can update it
    const updatedMockData = userMockData.map((user) =>
      user.id === id ? (user = { ...user, ...data }) : user
    );

    // Write the latest updated data into local JSON file
    writeFile(updatedMockData);
    const arr = updatedMockData.filter((user) => user.id === id);
    return Promise.resolve(arr[0]);
  } catch (error) {
    return Promise.reject(error);
  }
};

// If data exists in th JSON file then parse it
function isDataExits (userMockData) {
  if (userMockData && userMockData.length > 0) {
    userMockData = JSON.parse(userMockData);
    return userMockData;
  }
  return undefined;
}

// Read the contents of file
function readFile () {
  return fs.readFileSync(getUserMockDataFilePath());
}

// Write the contents to file
function writeFile (updatedMockData) {
  const stringifyData = JSON.stringify(updatedMockData);
  fs.writeFileSync(getUserMockDataFilePath(), stringifyData);
}

// Get the path of local JSON based file
const getUserMockDataFilePath = () => {
  return path.resolve(__dirname, "../assets/post.json");
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  isDataExits
};
