/*
* Title: Not Found Handler
* Description: 404 Not found Handler
* Date: 09 May, 2026
*/

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  callback(404, {
    message: 'Your Request URL was not Found',
  });
};

module.exports = handler;
