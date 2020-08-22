const Joi = require("joi");

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      fname: Joi.string().required(),
      lname: Joi.string().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
      email: Joi.string().email(),
      gender: Joi.any().valid(["male", "female"]),
      role: Joi.any().valid([""])
    },
    headers: {
      "x-access-token": Joi.string().required()
    }
  },
  
  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

 
};
