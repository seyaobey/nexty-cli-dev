"use strict";
exports.__esModule = true;
var cli_1 = require("./cli");
var cli = new cli_1.Cli();
cli.load_datasource().then(function (ans) {
    console.log(JSON.stringify(ans, null, '  '));
});
//# sourceMappingURL=index.js.map