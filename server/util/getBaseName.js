
var path = require('path');

module.exports = (fullPath => path.basename(fullPath, path.extname(fullPath)));
