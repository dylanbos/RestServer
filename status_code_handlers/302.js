var fileSystem = require('node-fs');

module.exports = {
    handler: function (res, resourcePath) {
        var content = JSON.parse(fileSystem.readFileSync(resourcePath));
        res.setHeader('Location', content.Location);
        res.status(302);
    }
};