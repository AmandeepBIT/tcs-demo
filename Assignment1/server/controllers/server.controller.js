const { StatusCodes } = require("http-status-codes");
const { findServer } = require("../services/server.service");

const getOnlineServer = async (req, res, next) => {
  try {
    const data = await findServer();
    return res.status(StatusCodes.OK).send({
      status: true,
      message: "Online Server Fetched Successfully",
      data
    });
  } catch (error) {
    const statusCode = error.status
      ? error.status
      : StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).send({
      status: false,
      message: error.message
    });
  }
};

module.exports = {
  getOnlineServer
};
