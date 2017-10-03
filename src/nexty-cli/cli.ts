
var root = require('root-path');
import * as _ from 'lodash';
import * as inquirer from 'inquirer';
import * as Q from 'q';
import * as fs from 'fs';

export class Cli {

    constructor(){
        this.app = require(root('/server/server.js'));        
    }

    load_datasource() {

        let ds_list = [];

        for (var k in this.app.datasources) {
            let _name = k.toLowerCase();
            if(ds_list.filter(n => n === _name).length <= 0){
                ds_list.push(_name);
            }
        }

        let d = Q.defer();

        inquirer.prompt([
            {
                type: 'list',    
                message: 'Select a datasource',
                name: 'datasource',   
                default: 'db',     
                choices: ds_list
            }
        ]).then( ans =>{
            let ds = ans.datasource;
            this.discover_models(ds).then(rs =>{
                d.resolve(rs);
            }).catch(err =>{
                d.reject(err);
            })
            
        }).catch(err =>{
            d.reject(err);
        });
        
        return d.promise;   
    }


    private discover_models(schema) {

        let ds = this.app.datasources[schema];

        let options = {
            schema: schema,
            relations: true,
            all: true            
        }

        let d = Q.defer();

        ds.discoverModelDefinitions(options, (err, models: string[]) =>{

            if(err){

                if(typeof err === 'string' ){
                    console.log('error: ' + err)
                }else{
                    console.log(JSON.stringify(err))
                }

                d.reject(false);
                
            }else{

                this.discover_schema(d, ds, schema, models[0], models, 0, models.length);
            }

        });
        return d.promise;
    }

    private discover_schema(d:Q.Deferred<any>, ds, owner, model, models, k, max) {

        ds.discoverSchema(model.name, { owner: owner}, (err, schema) =>{
            
            if(err){
                
                console.log('discover_schema: error');

                d.reject(err)

            }else{

                console.log(model.name);

                // process discovery
                this.write_files_for_model(owner, model.name, schema);

                let _next_k = k+1;
            
                let stop = max <= _next_k;

                if(stop){
                    console.log('discover_schema: completed');
                    d.resolve(true);
                }else{

                    let next_model = models[_next_k];

                    this.discover_schema(d, ds, owner, next_model, models, _next_k, max);
                }            
            }
            
        });    
    }

    private write_files_for_model(ds, modelname, schema) {

        let models_dir = root('/server/models');

        if(!fs.existsSync(models_dir)){
            fs.mkdirSync(models_dir);            
        }

        let filename = this.convertModelNameToFileName(modelname);

        fs.writeFileSync(`${models_dir}/${filename}.json`, JSON.stringify(schema,null,2));

        let _model_name = modelname[0].toUpperCase() + modelname.substring(1)

        fs.writeFileSync(`${models_dir}/${filename}.js`, this.defaultJsFileContents(_model_name));

        this.updateModelConfig(modelname, ds);

    }

    private updateModelConfig(model_name, ds) {     

        let config_path = root(`server/model-config.json`);
        
        var cfg = JSON.parse(fs.readFileSync(config_path) as any);
            cfg[model_name] = {
            dataSource: ds,
            public: false
        };

        fs.writeFileSync(config_path, JSON.stringify(cfg, null, 2));
    }

    private convertModelNameToFileName(modelName) {
        return modelName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }


    private defaultJsFileContents(modelName) {
        return `module.exports = function(${modelName}){};`;
    }

    private app: any;
}