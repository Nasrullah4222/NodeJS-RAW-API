/*
*
*Title: Uptime Monitoring Application
*Date: 09 May, 2026
*
*/
//Dependencise

const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');

//app object-module scaffolding
const app ={};

//configuration
app.config={
    port: 3000,
};

//create server
apop.createServer = ()=>{
    const server= http.createServer(app.handleReqRes);
    server.listen(app.config.port, ()=>{
        console.log(`listening on port ${app.config.port}`);
    });
};

//Handle Request Responses
app.handleReqRes = handleReqRes;

//start the server
app.createServer();