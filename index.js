
const config = require("./src/config/config");
const app = require("./src/config/express");
const db = require("./src/config/sequelize");

var server = require('http').createServer(app);

if (!module.parent) {
    server.listen(config.port, '0.0.0.0', () => {
        console.info(`server started on port ${config.port}(${config.env})`)
    });
}