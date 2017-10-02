"use strict";
exports.__esModule = true;
var root = require('root-path');
var Cli = (function () {
    function Cli() {
        this.app = require(root('/server/server.js'));
    }
    Cli.prototype.load_datasource = function () {
        /*
    inquirer.prompt([
        {
            type: 'list',
            message: 'Select a datasource',
            name: 'datasource',
            default: 'db',
            choices: ['db', 'mysql']
        }
    ]).then( ans =>{
        console.log(JSON.stringify(ans, null, '  '));
    });
        */
    };
    return Cli;
}());
exports.Cli = Cli;
//# sourceMappingURL=cli.js.map