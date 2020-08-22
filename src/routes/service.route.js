const express = require("express");

const authRoutes = require("./auth.route");
const router = express.Router();

/*=========== User Routes===============*/
router.use('/authentication', authRoutes);


module.exports = router;