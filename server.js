if (process.env.NODE_ENV == 'production');

const express = require('express');
const app     = express();

// Global base path used to import local modules as require(__base + "/modules/myModule")
global.__base = __dirname + "/app";

require('./settings').boot(app);

/* HTTP */
var port = process.env.PORT || 3001;
app.listen(port);
console.log('SERVER STARTED! PORT ' + port);
