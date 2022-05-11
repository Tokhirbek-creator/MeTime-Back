const Joi = require("@hapi/joi");

module.exports = {
  addUserValidation: (data) => {
    const schema = Joi.object({
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      dob: Joi.date().required(),
    }).options({ abortEarly: false });
    const { error, value } = schema.validate(data);
    return { error, value };
  },
}
