
var root = require('root-path');
import * as _ from 'lodash';
import * as inquirer from 'inquirer';
import * as Q from 'q';

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


    private discover_models(ds_name) {

        let ds = this.app.datasources[ds_name];

        let options = {
            schema: ds_name,
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

                let _res = [];

                models.forEach( (def:any) =>{
                    _res.push(def.name)
                });

                d.resolve(_res);
            }

        });

        return d.promise;

    }



    private app: any;
}