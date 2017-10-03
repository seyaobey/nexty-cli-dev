"use strict";
exports.__esModule = true;
var root = require('root-path');
var inquirer = require("inquirer");
var Q = require("q");
var fs = require("fs");
var Cli = (function () {
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
    Cli.prototype.discover_models = function (schema) {
        var _this = this;
        var ds = this.app.datasources[schema];
        var options = {
            schema: schema,
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
                _this.discover_schema(d, ds, schema, models[0], models, 0, models.length);
            }
        });
        return d.promise;
    };
    Cli.prototype.discover_schema = function (d, ds, owner, model, models, k, max) {
        var _this = this;
        ds.discoverSchema(model.name, { owner: owner }, function (err, schema) {
            if (err) {
                console.log('discover_schema: error');
                d.reject(err);
            }
            else {
                console.log(model.name);
                // process discovery
                _this.write_files_for_model(owner, model.name, schema);
                var _next_k = k + 1;
                var stop_1 = max <= _next_k;
                if (stop_1) {
                    console.log('discover_schema: completed');
                    d.resolve(true);
                }
                else {
                    var next_model = models[_next_k];
                    _this.discover_schema(d, ds, owner, next_model, models, _next_k, max);
                }
            }
        });
    };
    Cli.prototype.write_files_for_model = function (ds, modelname, schema) {
        var models_dir = root('/server/models');
        if (!fs.existsSync(models_dir)) {
            fs.mkdirSync(models_dir);
        }
        var filename = this.convertModelNameToFileName(modelname);
        fs.writeFileSync(models_dir + "/" + filename + ".json", JSON.stringify(schema, null, 2));
        var _model_name = modelname[0].toUpperCase() + modelname.substring(1);
        fs.writeFileSync(models_dir + "/" + filename + ".js", this.defaultJsFileContents(_model_name));
        this.updateModelConfig(modelname, ds);
    };
    Cli.prototype.updateModelConfig = function (model_name, ds) {
        var config_path = root("server/model-config.json");
        var cfg = JSON.parse(fs.readFileSync(config_path));
        cfg[model_name] = {
            dataSource: ds,
            public: true
        };
        fs.writeFileSync(config_path, JSON.stringify(cfg, null, 2));
    };
    Cli.prototype.convertModelNameToFileName = function (modelName) {
        return modelName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    };
    Cli.prototype.defaultJsFileContents = function (modelName) {
        return "module.exports = function(" + modelName + "){};";
    };
    return Cli;
}());
exports.Cli = Cli;
//# sourceMappingURL=cli.js.map