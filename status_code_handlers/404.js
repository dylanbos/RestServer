var fileSystem = require('node-fs');

module.exports = {
    handler: function (res, resourcePath) {
        var content = JSON.parse(fileSystem.readFileSync(resourcePath));
        res.status(404).send(content.Message);
    }
};