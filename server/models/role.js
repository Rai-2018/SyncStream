const mongoose = require("mongoose");

// const RoleSchem = mongoose.model(
//     "Role",
//     new mongoose.Schema({
//         name: String
//     })
// );

// module.exports = Role;


const RoleSchem = mongoose.Schema({
    name: { type: String, required: true },
});

module.exports = mongoose.model('Role', RoleSchem);