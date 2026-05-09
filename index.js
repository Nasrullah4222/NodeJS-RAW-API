/*
*
*Title: Uptime Monitoring Application
*Date: 09 May, 2026
*
*/

// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');

// app object-module scaffolding
const app = {};

// configuration
app.config = {
    port: 3000,
};

// Handle Request Responses
app.handleReqRes = handleReqRes;

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listening on port ${app.config.port}`);
    });
};

// start the server
app.createServer();