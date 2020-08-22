function IsEmptyObject(req,res, next) {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({ status:'error',statusCode: 400, message: "Please provide valid request body" });
    }
    next();
}


module.exports = IsEmptyObject; 