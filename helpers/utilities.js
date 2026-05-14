/*
* Title: Environments Handler
* Description: Handle all environment related things
* Date: 10 May, 2026
*/
//dependencies
const crypto = require('crypto');
const environments = require('./environment');
// module scaffolding

const utilities = {};


// parse JSON string to an object in all cases, without throwing
utilities.parseJSON = (jsonString) => {
    let output ={};
    try {
        output = JSON.parse(jsonString);
    } catch (error) {
        output = {};
    }
    return output;
};

// Hash String
utilities.hash = (str) => {
    if(typeof str === 'string' && str.length > 0) {
        const secretKey = typeof environments.secretKey === 'string' ? environments.secretKey : '';
        if (!secretKey) {
            return false;
        }
        const hash = crypto
        .createHmac('sha256', secretKey)
        .update(str)
        .digest('hex');
        return hash;
    } else {
        return false;
    }
};

module.exports = utilities;