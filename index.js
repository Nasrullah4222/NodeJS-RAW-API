/*
*
*Title: Uptime Monitoring Application
*Date: 09 May, 2026
*
*/

// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./handler/routeHandeler/environment');
const data = require('./lib/data');

// app object-module scaffolding
const app = {};

//testing file system
//ToDO: Pore Dikha jabe

data.create('test', 'newFile', { name: 'Bangladesh', language: 'Bangla' }, err => {
    console.log(err);
});

/*
data.read('test', 'newFile', (err, data) => {
    console.log(err, data);
});

data.update('test', 'newFile', { name: 'England', language: 'English' }, err => {
    console.log(err);
});

data.delete('test', 'newFile', err => {
    if (!err) {
        console.log('File deleted successfully');   
    }
});
*/

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