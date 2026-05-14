/*
* Title: Handle Request Response
* Description: Handle Request and Response
* Date: 09 May, 2026
*/
// dependencies
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { parseJSON } = require('./utilities');
const { notFoundHandler } = require('../handler/routeHandeler/notFoundHandler');

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  const baseUrl = `http://${req.headers.host || 'localhost'}`;
  const parsedUrl = new URL(req.url, baseUrl);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryStringObject = Object.fromEntries(parsedUrl.searchParams.entries());
  const headersObject = req.headers;

  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headersObject,
  };

  const decoder = new StringDecoder('utf-8');
  let realData = '';

  const chosenHandler = typeof routes[trimmedPath] !== 'undefined' ? routes[trimmedPath] : notFoundHandler;

  req.on('data', buffer => {
    realData += decoder.write(buffer);
  });

  req.on('end', () => {
    realData += decoder.end();

    requestProperties.body = parseJSON(realData);
    
    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === 'number' ? statusCode : 500;
      payload = typeof payload === 'object' ? payload : {};
      const payloadString = JSON.stringify(payload);
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(payloadString);
    });
  });
};

module.exports = handler;
