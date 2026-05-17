/*
* Title: Routes
* Description: Application Routes
* Date: 09 May, 2026
*/

// dependencies
const { sampleHandler } = require('./handler/routeHandeler/sampleHandler');
const { userHandler } = require('./handler/routeHandeler/userHandler');
const { tokenHandler } = require('./handler/routeHandeler/tokenHandler');


const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
