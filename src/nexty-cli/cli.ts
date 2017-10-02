
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
            d.resolve(ans);            
        });
        
        return d.promise;
   
    }

    private app: any;
}