/*
* Title: Routes
* Description: Application Routes
* Date: 09 May, 2026
*/

// dependencies
const { sampleHandler } = require('./handler/routerHandlers/sampleHandler');

const routes = {
  sample: sampleHandler,
};

module.exports = routes;
