/**
 * Module dependencies.
 */
const bodyParser = require('body-parser');
const mysql = require('mysql');

/**
 * Description
 * @method boot
 * @param {} api
 * @param {} api_version
 * @return
 */
exports.boot = function (api) {
    /******************************************
     *                                         *
     *      LOAD CONFIGURATIONS                *
     *                                         *
     *******************************************/
    global.ENV 	   				= process.env.NODE_ENV || 'development';
    console.log("STARTING IN " + ( process.env.NODE_ENV || 'development') + " MODE.");
    global.CONFIG  = require('./app/config/' + global.ENV);
    api.use(bodyParser.urlencoded({ extended: false }));
    api.use(bodyParser.json());
    api.use(function (req, res, next) {
        res.header('Accept', 'application/json');
        res.header("Content-Type", "application/json;charset=utf-8");
        res.header("Access-Control-Allow-Headers","X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
        res.header("Access-Control-Allow-Origin", global.CONFIG.allowOrigin);
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
        next();
    });
    require('./app/config/routes')(api);


    global.databasePool = mysql.createPool(global.CONFIG.database);


    console.log("RUNNING BRAVI-REST-API...");

};
