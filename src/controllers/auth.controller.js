const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const authService = require("../services/auth.service");
const bcryptService1= require("../services/bcrypt.service");
var smtpTransport = require('nodemailer-smtp-transport');
const db = require("../config/sequelize");
var nodemailer = require("nodemailer");
const Joi = require('joi');
const validator = require("../validations/memberregister");
const config = require('../config/config');
const user_tbl = db.users;
const role_tbl = db.roles;


var smtpTransport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: config.mailid,
        pass: config.pwd
    }
}));

const AuthController = () => { 
	   
     //super admin can register members and email link will sent to memeber acceptance
    const registerMember = async (req, res, next) => {
        try {
            const postData = req.body;
            const { user_uuid } = req.headers;
            let validateObject = await Joi.validate(postData, validator.addMemberVal);
            console.log(validateObject);
           // return res.send(validateObject);
                if (validateObject.name== "ValidationError") {
                return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ status: 'error', statusCode: httpStatus.UNPROCESSABLE_ENTITY, message: validateObject.error.details[0].message });
            }
            const memberExists = await checkDuplicateMember(postData);
            if (memberExists && memberExists >= 1) {
                return res.status(422).json({ statusCode: 422, message: "Member alraedy exists with maild id" });
             }
            const passWord = bcryptService1().password(postData.password);
            const verify_string = bcryptService1().password(postData.user_name);
            await Promise.all([passWord],[verify_string]);
            let regData = await regMemData(postData, passWord, user_uuid,verify_string);
            let user_tbl_insert = await user_tbl.create(regData);
            let sendEmail = await sendEmailToMember(user_tbl_insert);
            if (sendEmail.statusCode != 200) {
                return res.status(500).json({
                    statusCode: 500,
                    message: sendEmail.error,

                })
            }
            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                responseContents: user_tbl_insert
               })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                statusCode: 500,
                message: "failed",
                responseContents: error,
            });
        }
    };		
     
    //to login with username and password
	const login = async (req, res, next) => {
    try{
        const postData=req.body;
        let validateObject = await Joi.validate(postData, validator.loginDataCheck);
        if (validateObject.error != null) {
          return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ status: 'error', statusCode: httpStatus.UNPROCESSABLE_ENTITY, message: validateObject.error.details[0].message });
        }
        const {user_name, password } = postData;
         const user = await user_tbl.findOne({
					where:{
                     user_name:user_name,
                     is_active:true,
                     status:true
                    }
				});
			
				if (!user) {
					return res.status(httpStatus.BAD_REQUEST).json({ msg: "User not found" });
				}
                  let chekUser= await bcryptService1().comparePassword(password, user.dataValues.password);
                   if(chekUser==true){
                    const token = authService().issue({ id: user.uuid });
                     const userroledata= await role_tbl.findOne({where:{uuid:user.dataValues.role_uuid}})
					return res.status(httpStatus.OK).json({ token:token,userdata:user,role_data:userroledata});
                    }
                    else{
                        return res.status(httpStatus.BAD_REQUEST).json({statusCode:400, msg: "username or password wrong"});
                    }
				
			} catch (err) {
				console.log(err);
				return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ satusCode:500,msg: "Internal server error" });
			}
		

		return res.status(httpStatus.BAD_REQUEST).json({ msg: "Email or password is wrong works" });
    };
    //member accptance for cms registration
    const memberAcceptance = async (req, res, next) => {
        try{
           const id=req.query.id;
           let updatedat={                 
            status:true,
            is_active:true,
            modified_date:new Date(),
            modified_by:req.headers.user_uuid
           };
          await user_tbl.update(updatedat,{where:{uuid:id}});
          return res.status(200).json({
                statusCode:200,
                message:" your accepted request Successfullly",
                          
            })
           }
           catch(error){
           console.log(error);
           return res.status(500).json({
               statusCode:500,
               message:"failed",
               responseContents:error,          
           })   
         } 
    };	

    //to list all invitees with details
    const getAllInvites = async (req, res, next) => {
        try {
            const postData = req.body;
            if (Object.keys(postData).length === 0) {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json({
                        status: "failed",
                        msg: "object is undefined",
                        statusCode: 400
                    });
            }
            let pageNo = 0;
            const itemsPerPage = postData.paginationSize ? postData.paginationSize : 10;
            let sortArr = ['modified_date', 'DESC'];
            if (postData.pageNo) {
                let temp = parseInt(postData.pageNo);
                if (temp && (temp != NaN)) {
                    pageNo = temp;
                }
            }
            const offset = pageNo * itemsPerPage;
            let fieldSplitArr = [];
            if (postData.sortField) {
                fieldSplitArr = postData.sortField.split('.');
                if (fieldSplitArr.length == 1) {
                    sortArr[0] = postData.sortField;
                } else {
                    for (let idx = 0; idx < fieldSplitArr.length; idx++) {
                        const element = fieldSplitArr[idx];
                        fieldSplitArr[idx] = element.replace(/\[\/?.+?\]/ig, '');
                    }
                    sortArr = fieldSplitArr;
                }
            }
            if (postData.sortOrder && ((postData.sortOrder.toLowerCase() == 'asc') || (postData.sortOrder.toLowerCase() == 'desc'))) {
                if ((fieldSplitArr.length == 1) || (fieldSplitArr.length == 0)) {
                    sortArr[1] = postData.sortOrder;
                } else {
                    sortArr.push(postData.sortOrder);
                }
            }
            let findQuery = {
                offset: offset,
                limit: itemsPerPage,
                order: [
                    sortArr
                ],

            };
            if (postData.search && /\S/.test(postData.search)) {
                findQuery.where = Object.assign(findQuery.where, {
                    [Sequelize.Op.or]: [
                        {
                            user_name: {
                                [Sequelize.Op.like]: "%" + postData.search + "%"
                            }
                        },
                        {
                            email: {
                                [Sequelize.Op.like]: "%" + postData.email + "%"
                            }
                        },
                    ]
                });
            }
            if (postData.user_name && /\S/.test(postData.user_name)) {
                findQuery.where = Object.assign(findQuery.where, {
                    user_name: {
                        [Sequelize.Op.like]: "%" + postData.nauser_nameme + "%"
                    }
                });
            }
            if (postData.email && /\S/.test(postData.email)) {
                findQuery.where = Object.assign(findQuery.where, {
                    email: postData.email
                });
            }
            let getdata = await user_tbl.findAndCountAll(findQuery);
            if (getdata.count == 0) {
                return res
                    .status(httpStatus.OK)
                    .json({
                        statusCode: 200,
                        message: "Get Details Fetched successfully",
                        responseContents: [],
                        totalRecords: 0
                    });
            }
            return res
                .status(httpStatus.OK)
                .json({
                    statusCode: 200,
                    message: "Get Details Fetched successfully",
                    responseContents: getdata.rows,
                    totalRecords: getdata.count
                });

        }

        catch (err) {
            console.log(err);

            const errorMsg = err.errors ? err.errors[0].message : err.message;
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({
                    statusCode: 500,
                    status: "error",
                    msg: errorMsg
                });
        };
    }

   

	return {
		login,
        registerMember,
        memberAcceptance,
        getAllInvites

	
	};

}
module.exports = AuthController();
//to check register member alreay exist with active status or not
async function checkDuplicateMember(Memdata){
    try{
     const{user_name}=Memdata;
     const memcount=await user_tbl.count({
         where:{
        user_name:user_name,
          is_active:true,
          status:true
         }

        });
     return memcount;
       }
       catch(err){
       throw new Error(err);
       }     
};
//adding required data for regidter data
async function regMemData(details,pwd,user_uuid,verify_string){
    try{
      let memdata= {
        user_name:details.user_name,
        password:pwd,
        gender_uuid:details.gender_uuid,
        salutation_uuid:details.salutation_uuid,
        employee_code:details.employee_code,
        verification_string:verify_string,
        email:details.email,
        role_uuid:details.role_uuid ?  details.role_uuid:2,
        mobile1:details.mobile1,
        mobile2:details.mobile2,
        is_active:false,
        status:false,
        created_by:user_uuid,
        created_date:new Date(),
        modified_by:0,    
            }
    
      return memdata;
       }
       catch(err){
       throw new Error(err);
       }     
}; 
//to send email link to accept registration   
async function sendEmailToMember(data){
 try{
      const email=data.dataValues.email;
      const uuid=data.dataValues.uuid;
      const username =data.dataValues.user_name;
       var mailOptions = {
                from:config.mailid ,
                to: email,
                subject: "You have registerd for cms by admin",
                text: "text",              
                html: '<p>Click <a href="http://localhost:3002/api/authentication/memberAcceptance?id=' + uuid + '">here</a> Toaccept cms registartion by admin</p>'
            }    
        let dat= await smtpTransport.sendMail(mailOptions) 
        return {"statusCode":200,"message":"success"} ;  
     }
    catch(err){
     return {"statusCode":500,"message":err}
    }   
};
