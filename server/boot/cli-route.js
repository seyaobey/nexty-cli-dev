'use strict';
var cli_1 = require("../nexty-cli/cli");
module.exports = function (app) {
    app.get('/cli', function (req, res, next) {
        var cli = new cli_1.Cli();
        cli.load_datasource().then(function (_res) {
            res.send(_res);
        })["catch"](function (err) {
            next(err);
        });
    });
};
//# sourceMappingURL=cli-route.js.map