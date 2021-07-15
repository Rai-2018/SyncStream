const checkRegistration = require("../middlewares/checkRegistration");
const controller = require("../actions/auth-actions");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/auth/register",
        [checkRegistration.checkDuplicates, checkRegistration.checkRoles],
        controller.register
    );
    app.post("/api/auth/signin", controller.signin);
};