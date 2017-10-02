
import { Cli } from './cli';

var cli:Cli = new Cli();

cli.load_datasource().then( ans =>{
    console.log(JSON.stringify(ans, null, '  '))
});