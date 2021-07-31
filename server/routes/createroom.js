const fetch = require("node-fetch");
const controller = require("../actions/createroom-actions");

module.exports = function(app) {
    app.get('/random', (req, res, next) => {
        var randname;
        fetch('http://names.drycodes.com/1', {
                    method:'GET',
                })
            .then(response => response.json())
            .then(function(data){
                res.status(200).json({
                    message: data
                })
            });
    });

    app.post('/cr', controller.createroom)

    app.post('/jr', controller.joinroom)
}