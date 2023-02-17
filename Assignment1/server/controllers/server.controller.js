const { StatusCodes } = require("http-status-codes");
const { findServer } = require("../services/server.service");

/** This function is responsible for controlls the res and response as per server availabilities
 *
 * @param {*} req; // We can catch the params here from the req
 * @param {*} res; // res will catch the response at the end after getting resonse or error
 * @param {*} next;
 * @returns
 */
const getOnlineServer = async (req, res, next) => {
  try {
    // Going to check for all available server and will get back with available server as per priority
    const data = await findServer();

    // This statement will throw the response back to user with available servers
    return res.status(StatusCodes.OK).send({
      status: true,
      message: (data && data.length > 0) ? "Online Server Fetched Successfully" : "No Server Found",
      data
    });
  } catch (error) {
    // This statement will throw the errors back to user with proper error
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
