const { StatusCodes } = require("http-status-codes");
const {
  addUser,
  getAllUsers,
  updateUser,
  getUserById
} = require("../services/user.service");
const addUserSchema = require("../schema/addUser.schema");

const addUserController = async (req, res, next) => {
  const { error } = addUserSchema.validate(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      status: false,
      message: error.message
    });
  }
  try {
    const data = await addUser(req.body);
    return res.status(StatusCodes.OK).send({
      status: true,
      message: "User Added Successfully",
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

const viewUserController = async (req, res, next) => {
  try {
    const { id } = req.query;
    const data = id ? await getUserById(Number(id)) : await getAllUsers();
    return res.status(StatusCodes.OK).send({
      status: true,
      message: (data && data.length > 0) ? "User Fetched Successfully" : "No Record Found",
      data: (data && data.length > 0) ? data : []
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

const updateUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await updateUser(Number(id), req.body);
    return res.status(StatusCodes.OK).send({
      status: true,
      message: "User Updated Successfully",
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
  addUserController,
  viewUserController,
  updateUserController
};
