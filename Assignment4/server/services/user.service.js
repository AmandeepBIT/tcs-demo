const fs = require("fs");
const path = require("path");
const { StatusCodes } = require("http-status-codes");

const addUser = async (data) => {
  try {
    let userMockData = readFile();
    userMockData = isDataExits(userMockData);

    const id = (userMockData && userMockData.length > 0) ? userMockData?.length + 1 : 1;
    const record = { ...data, id };
    const updatedMockData = (userMockData && userMockData.length > 0) ? [...userMockData, record] : [record];

    writeFile(updatedMockData);
    return Promise.resolve(record);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getAllUsers = async () => {
  try {
    let userMockData = readFile();
    userMockData = isDataExits(userMockData);
    return Promise.resolve(userMockData);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getUserById = async (id) => {
  try {
    let userMockData = readFile();
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
    return Promise.reject(error);
  }
};

const updateUser = async (id, data) => {
  try {
    let userMockData = readFile();
    userMockData = isDataExits(userMockData);
    const user = userMockData
      ? userMockData.find((user) => user.id === id)
      : undefined;
    if (!user) {
      return Promise.reject(new Error({
        status: StatusCodes.NOT_FOUND,
        message: "User Not Found"
      }));
    }
    const updatedMockData = userMockData.map((user) =>
      user.id === id ? (user = { ...user, ...data }) : user
    );
    writeFile(updatedMockData);
    const arr = updatedMockData.filter((user) => user.id === id);
    return Promise.resolve(arr[0]);
  } catch (error) {
    return Promise.reject(error);
  }
};

function isDataExits (userMockData) {
  if (userMockData && userMockData.length > 0) {
    userMockData = JSON.parse(userMockData);
    return userMockData;
  }
  return undefined;
}

function readFile () {
  return fs.readFileSync(getUserMockDataFilePath());
}
function writeFile (updatedMockData) {
  const stringifyData = JSON.stringify(updatedMockData);
  fs.writeFileSync(getUserMockDataFilePath(), stringifyData);
}

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
