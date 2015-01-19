var fileSystem = require('node-fs');

module.exports = {
    handler: function (res, resourcePath) {
        res.contentType('application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.status(200).send(fileSystem.readFileSync(resourcePath));
    }
};

