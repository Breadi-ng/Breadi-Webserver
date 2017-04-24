var express = require('express');
var subdomain = require('express-subdomain');
var path = require('path');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var bodyParser = require('body-parser');

var moment = require('moment');

var port = process.env.PORT || 3090;

var app = express();

app.set('port', port);

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/1';

var databaseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/breadi';

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

if ('production' == app.settings.env) app.disable('verbose errors');

var serverUri;
if (process.env.PARSE_SERVER_URI) {
  serverUri = process.env.PARSE_SERVER_URI + process.env.PARSE_MOUNT;
} else {
  serverUri = 'http://localhost:'+port+mountPath;
}
var publicServerURL;
if (process.env.PUB_SERVER_URL) {
  publicServerURL = process.env.PUB_SERVER_URL + mountPath;
} else {
  publicServerURL = 'http://localhost:'+port+mountPath;
}

var api = new ParseServer({
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'VMvhutWAGNpk78QXprTt',
  masterKey: process.env.MASTER_KEY || '8zqndJmKVnQER6aXsnWR', //Add your master key here. Keep it secret!
  serverURL: serverUri,  // Don't forget to change to https if needed
  // Enable email verification
  appName: 'Breadi',
  publicServerURL: publicServerURL,
  liveQuery: {
    classNames: ['_User', 'Pairing']
  }
});

app.use(bodyParser.json());

var dashboard = new ParseDashboard({
  "apps" : [
    {
      "serverURL": "http://localhost:3030/1",
      "appId": "VMvhutWAGNpk78QXprTt",
      "masterKey": "8zqndJmKVnQER6aXsnWR",
      "appName": "Breadi local"
    },
    {
      "serverURL": "https://api.breadi.tk/1",
      "appId": "VMvhutWAGNpk78QXprTt",
      "masterKey": "8zqndJmKVnQER6aXsnWR",
      "appName": "Breadi.tk"
    }
  ],
  "users" : [
    {
      "user":"pikin",
      "pass":"admin2017"
    }
  ]
});

app.use(subdomain('api',(mountPath, api)));

app.use(subdomain('admin', dashboard));


module.exports = app;