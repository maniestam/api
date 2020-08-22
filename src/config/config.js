const Joi = require("joi");
require("dotenv").config({ path: __dirname + '/../../.env' });

const envVarsSchema = Joi.object({
        PG_DB_LOGGING: Joi.string().default(0),
        NODE_ENV: Joi.string()
            .allow(["development","test"])
            .default("development"),
        PORT: Joi.number().default(3001),
        JWT_SECRET: Joi.string()
            .default("GREAT!@!#$$%@%$SFA")
            .description("JWT Secret required to sign"),
        JWT_TOKEN_EXPIRE: Joi.string()
            .default("1d")
            .description("JWT Token Expired in Days"),
        PG_DB: Joi.string()
            .default("sfa")
            .description("test"),
        PG_PORT: Joi.number().default(3301),
        // SMTP_PORT: Joi.number().default(1337),
        PG_HOST: Joi.string().default("127.0.0.1"),
        PG_USER: Joi.string()
            .default("root")
            .description("root"),
        PG_PASSWORD: Joi.string()
            .default("root")
            .allow("")
            .description("test")
    })
    .unknown()
    .required();

const {
    error,
    value: envVars
} = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {

    env: envVars.NODE_ENV,
    port: envVars.PORT,
    jwtSecret: envVars.JWT_SECRET,
    mailid:envVars.emailid,
    pwd:envVars.password,
    jwtTokenExpire: envVars.JWT_TOKEN_EXPIRE,  
     mysql: {
        db: envVars.PG_DB,
        db_org: envVars.PG_DB_ORG,
        port: envVars.PG_PORT,
        host: envVars.PG_HOST,
        user: envVars.PG_USER,
        password: envVars.PG_PASSWORD,
        dialect: "mysql"
    },
    
}

module.exports = config