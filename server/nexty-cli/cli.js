"use strict";
exports.__esModule = true;
var root = require('root-path');
var inquirer = require("inquirer");
var Q = require("q");
var Cli = /** @class */ (function () {
    function Cli() {
        this.app = require(root('/server/server.js'));
    }
    Cli.prototype.load_datasource = function () {
        var _this = this;
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
            var ds = ans.datasource;
            _this.discover_models(ds).then(function (rs) {
                d.resolve(rs);
            })["catch"](function (err) {
                d.reject(err);
            });
        })["catch"](function (err) {
            d.reject(err);
        });
        return d.promise;
    };
    Cli.prototype.discover_models = function (ds_name) {
        var ds = this.app.datasources[ds_name];
        var options = {
            schema: ds_name,
            relations: true,
            all: true
        };
        var d = Q.defer();
        ds.discoverModelDefinitions(options, function (err, models) {
            if (err) {
                if (typeof err === 'string') {
                    console.log('error: ' + err);
                }
                else {
                    console.log(JSON.stringify(err));
                }
                d.reject(false);
            }
            else {
                var _res_1 = [];
                models.forEach(function (def) {
                    _res_1.push(def.name);
                });
                d.resolve(_res_1);
            }
        });
        return d.promise;
    };
    return Cli;
}());
exports.Cli = Cli;
//# sourceMappingURL=cli.js.map