
const config = require('../config/config');

const middleware = () => {
    const isAuthorized = (req, res, next) => {
        if (req && req.headers && req.headers.user_uuid && req.headers.user_uuid > 0) {
            next();
        }
        else {
            return res.status(403).json({
                statusCode: 403,
                message: "You are not Authorized"
            });
        }
    };

    return {
        isAuthorized,

    };
};

module.exports = middleware();