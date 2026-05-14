/*
*
*Title: Uptime Monitoring Application
*Date: 09 May, 2026
*
*/

// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environment');
const data = require('./lib/data');

// app object-module scaffolding
const app = {};


// Handle Request Responses
app.handleReqRes = handleReqRes;

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`listening on port ${environment.port}`);
    });
};

// start the server
app.createServer();