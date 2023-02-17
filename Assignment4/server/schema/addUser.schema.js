const Joi = require("joi");

module.exports = Joi.object({
  name: Joi.string().required(),
  age: Joi.string().required(),
  gender: Joi.string().required(),
  email: Joi.string().required()
});
