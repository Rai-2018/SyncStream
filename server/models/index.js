const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.user = require("./user");
db.role = require("./role");
db.Room = require('./room');
db.video = require('./video');

db.ROLES = ["user", "moderator", "admin"];
module.exports = db;
