//setup Dependencies
var express = require('express'),
    path = require('path'),
    options = require('node-options'),
    fileSystem = require('node-fs'),
    statusCodes = require('./statusCodes');

var rootDir = path.resolve('.', 'resources').toLowerCase();

var opts =  {
    "port"    : process.env.PORT | 1008,
    "verbose" : false
};

options.parse(process.argv.slice(2), opts);

//Setup Express
var app = express();
app.use(express.bodyParser());
app.listen(opts.port);

app.all('/examples/:resource/:id', function (req, res) {
    if (req.method == 'GET') {
        var id = req.params.id.toLocaleLowerCase();
        var resource = req.params.resource.toLocaleLowerCase();
        var resourceDir = path.resolve(path.resolve(rootDir, resource), id);

        console.log('');
        console.log('id = %s', id);
        console.log('resource = %s', resource);
        console.log('resource dir = %s', resourceDir);

        if (fileSystem.existsSync(resourceDir)) {
            var files = fileSystem.readdirSync(resourceDir)
            if (files.length === 0) {
                var message = stringFormat('There was no file in the resource path \'{0}\'', resourceDir);
                res.status(404).send(message);
                res.end();
            } else if (files.length > 1) {
                var message = stringFormat('Ambiguous response, there is more than 1 file in the resource path \'{0}\'', resourceDir);
                res.status(409).send(message);
                res.end();
            } else {
                var file = files[0];
                var parts = file.split('.');
                if (parts.length === 2) {
                    var code = parts[0];
                    var resourcePath = path.resolve(resourceDir, file);
                    statusCodes.populateResponse(res, code, resourcePath);
                } else {
                    var message = stringFormat('Ambiguous resource name, file should be <CODE>.json, file is \'{0}\'', file);
                    res.status(409).send(message);
                    res.end();
                }
            }
        } else {
            res.status(404).send('The resource does not exist...');
            res.end();
        }
    } else {
        res.status(404).send('Don\'t know what you\'re looking for...');
        res.end();
    }
});

app.all('*', function (req, res) {
    res.status(404).send('Don\'t know what you\'re looking for...');
    res.end();
});

console.log('Listening on http://localhost:' + opts.port);
console.log('Root directory = \'' + rootDir + '\'');

function stringFormat(format /* arg1, arg2... */) {
    if (arguments.length === 0) {
        return undefined;
    }
    if (arguments.length === 1) {
        return format;
    }
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
        if (m === "{{") {
            return "{";
        }
        if (m === "}}") {
            return "}";
        }
        return args[n];
    });
}