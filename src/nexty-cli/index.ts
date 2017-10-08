
import { Cli } from './cli';

var cli:Cli = new Cli();

cli.generate_models().then(res =>{
    console.log(res);
})
.catch(err =>{
    console.log('error')
})
.finally( () =>{
    console.log('exit');
});