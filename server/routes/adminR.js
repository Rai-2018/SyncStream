const fetch = require("node-fetch");
const controller = require("../actions/auth-actions");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post('/admin/allusers', controller.getAllUser);

}


