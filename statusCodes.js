var fileSystem = require('node-fs'),
    path = require('path'),
    statuses = undefined;

module.exports = {
    populateResponse: function (res, statusCode, resourcePath) {
        console.log('handling status code %s', statusCode);
        console.log('resource path = %s', resourcePath);

        var resource = fileSystem.readFileSync(resourcePath);
        if (!statuses) {
            statuses = [];
            var handlersPath = path.resolve('.', 'status_code_handlers').toLowerCase();
            var handlerFiles = fileSystem.readdirSync(handlersPath)
            handlerFiles.map(function(x) {
                var code = x.split('.')[0];
                var handlerPath = path.resolve(handlersPath, x);

                var module = require(handlerPath);
                statuses.push({ code : code, handler : module.handler });
            })
        }

        var handled = false;

        statuses.map(function(x){
            if (x.code === statusCode) {
                x.handler(res, resourcePath);
                res.end();
                handled = true;
            }
        })

        if (!handled) {
            res.status(500).send('No status code handler defined...');
            res.end();
        }
    }
};