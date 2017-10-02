'use strict';
var cli_1 = require("../nexty-cli/cli");
module.exports = function (app) {
    app.get('/cli', function (req, res, next) {
        var cli = new cli_1.Cli();
        cli.load_datasource();
    });
};
//# sourceMappingURL=cli.js.map