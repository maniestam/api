const Joi = require('joi');
const val_function = require("./custom_joi");

const addMemberVal = Joi.object().keys({
  user_name: Joi.string().min(3).required(),
  employee_code: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
    salutation_uuid: Joi.number().optional(),
    role_uuid: Joi.number().optional(),
    gender_uuid: Joi.number().required(),
    email: Joi.string().min(2).required(),
    mobile1:Joi.string().min(2).optional(),
   user_type_uuid: Joi.number().optional(),
   mobile2: Joi.number().optional(),
     
});




const loginDataCheck = Joi.object().keys({
  user_name: Joi.string().min(3).required(),
    password: Joi.string().min(6).required()  
});



module.exports = {addMemberVal,loginDataCheck};
