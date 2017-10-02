'use strict';
import { Cli } from '../nexty-cli/cli';
import { Request, Response } from 'express';

export = (app) =>{
    
    app.get('/cli', (req: Request, res: Response, next) =>{
        var cli: Cli = new Cli();
        cli.load_datasource();
        res.send({
            ok: true
        });
    });
}



/*
'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);
};
*/