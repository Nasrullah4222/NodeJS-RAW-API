/*
* Title: Handle Request Response
* Description: Handle Request and Response
* Date: 09 May, 2026
*/
// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handler/routeHandeler/notFoundHandler');

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
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
    realData += decoder.end() || '';
    if (realData) requestProperties.body = realData;

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
