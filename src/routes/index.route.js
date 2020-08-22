const express = require("express");
const serviceRoutes = require("./service.route");

const router = express.Router();

const config = require("../config/config");

router.use('/api', serviceRoutes);

module.exports = router


