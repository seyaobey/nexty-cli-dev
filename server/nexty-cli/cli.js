"use strict";
exports.__esModule = true;
var root = require('root-path');
var inquirer = require("inquirer");
var Q = require("q");
var Cli = (function () {
    function Cli() {
        this.app = require(root('/server/server.js'));
    }
    Cli.prototype.load_datasource = function () {
        var ds_list = [];
        var _loop_1 = function () {
            var _name = k.toLowerCase();
            if (ds_list.filter(function (n) { return n === _name; }).length <= 0) {
                ds_list.push(_name);
            }
        };
        for (var k in this.app.datasources) {
            _loop_1();
        }
        var d = Q.defer();
        inquirer.prompt([
            {
                type: 'list',
                message: 'Select a datasource',
                name: 'datasource',
                "default": 'db',
                choices: ds_list
            }
        ]).then(function (ans) {
            d.resolve(ans);
        });
        return d.promise;
    };
    return Cli;
}());
exports.Cli = Cli;
//# sourceMappingURL=cli.js.map