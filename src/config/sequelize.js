var Sequelize = require("sequelize");
var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var config = require("./config");

const db = {};


const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

// connect to mysql db
const sequelize = new Sequelize(
  config.mysql.db,
  config.mysql.user,
  config.mysql.password, {
    dialect: "mysql",
    port: config.mysql.port,
    host: config.mysql.host,
    define: {
      timestamps: true
    },
    logging: console.log,
    dialectOptions: {
      // useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: true,
      timezone: "+05:30"
    },
    timezone: '+05:30'
  }
);


const modelsDir = path.normalize(`${__dirname}/../models`);


// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(modelsDir)
  .filter(file => file.indexOf(".") !== 0 && file.indexOf(".map") === -1)
  // import model files and save model names
  .forEach(file => {
    // console.info(`Loading model file ${file}`);
    const model = sequelize.import(path.join(modelsDir, file));
    db[model.name] = model;
  });

// calling all the associate function, in order to make the association between the models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
// assign the sequelize variables to the db object and returning the db.
module.exports = _.extend(
  {
    sequelize,
    Sequelize
  },
  db
);
