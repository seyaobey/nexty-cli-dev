"use strict";
exports.__esModule = true;
var cli_1 = require("./cli");
var cli = new cli_1.Cli();
cli.load_datasource().then(function (res) {
    console.log(res);
})["catch"](function (err) {
    console.log('error');
})["finally"](function () {
    console.log('exit');
});
//# sourceMappingURL=index.js.map