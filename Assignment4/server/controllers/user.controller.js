const { StatusCodes } = require("http-status-codes");
const {
  addUser,
  getAllUsers,
  updateUser,
  getUserById
} = require("../services/user.service");
const addUserSchema = require("../schema/addUser.schema");

/** This function is responsible to add the user in local DB file
 *
 * @param {*} req; // We can catch the params here from the req
 * @param {*} res; // res will catch the response at the end after getting resonse or error
 * @param {*} next;
 * @returns
 */
const addUserController = async (req, res, next) => {
  // Validate the request via JOI schema
  const { error } = addUserSchema.validate(req.body);
  if (error) { // If required fields not in request body then throw error
    return res.status(StatusCodes.BAD_REQUEST).send({
      status: false,
      message: error.message
    });
  }
  try {
    // Call method to add the user
    const data = await addUser(req.body);
    return res.status(StatusCodes.OK).send({
      status: true,
      message: "User Added Successfully",
      data
    });
  } catch (error) {
    // handle error
    errorHandler(res, error);
  }
};

/** This function is responsible to view the list of all users or particular user as per request
 *
 * @param {*} req; // We can catch the params here from the req
 * @param {*} res; // res will catch the response at the end after getting resonse or error
 * @param {*} next;
 * @returns
 */
const viewUserController = async (req, res, next) => {
  try {
    // Fetch the id from query params
    const { id } = req.query;

    // Perform operations as per request
    const data = id ? await getUserById(Number(id)) : await getAllUsers();
    return res.status(StatusCodes.OK).send({
      status: true,
      message: (data && data.length > 0) ? "User Fetched Successfully" : "No Record Found",
      data: (data && data.length > 0) ? data : []
    });
  } catch (error) {
    // handle error
    errorHandler(res, error);
  }
};

/** This function is responsible to update the user as per request
 * @param {*} req; // We can catch the params here from the req
 * @param {*} res; // res will catch the response at the end after getting resonse or error
 * @param {*} next;
 * @returns
 */
const updateUserController = async (req, res, next) => {
  try {
    // Fetch the id from query params
    const { id } = req.params;

    // Call update user method to update the user
    const data = await updateUser(Number(id), req.body);
    return res.status(StatusCodes.OK).send({
      status: true,
      message: "User Updated Successfully",
      data
    });
  } catch (error) {
    // Handle error
    errorHandler(res, error);
  }
};

// This function is kind of generic method to handle the errors
function errorHandler (res, error) {
  const statusCode = error.status
    ? error.status
    : StatusCodes.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).send({
    status: false,
    message: error.message
  });
}

module.exports = {
  addUserController,
  viewUserController,
  updateUserController
};
