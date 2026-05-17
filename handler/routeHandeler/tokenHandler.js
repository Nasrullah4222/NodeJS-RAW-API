/*
* Title: Token Handler
* Description: Handle token related routes
* Date: 09 May, 2026
*/
// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { createRandomString } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        const methodHandler = handler._token[requestProperties.method];
        if (typeof methodHandler === 'function') {
            methodHandler(requestProperties, callback);
        } else {
            callback(405, {
                message: 'Method not allowed',
            });
        }
    } else {
        callback(405, {
            message: 'Method not allowed',
        });
    }
};
handler._token = {};


handler._token.post = (requestProperties, callback) => {  
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    
    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                const hashedpassword = hash(password);
                if (hashedpassword === parseJSON(userData).password) {
                    const tokenId = createRandomString(20);
                    const expires = Date.now() + 60 * 60 * 1000;
                    const tokenObject = {
                        phone,
                        id: tokenId,
                        expires,
                    };

                    data.create('tokens', tokenId, tokenObject, (err) => {
                        console.log('token create err:', err);
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {
                                error: 'There was a problem in the server side!',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'Password is incorrect',
                    });
                }
            } else {
                callback(400, {
                    error: 'User not found',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

handler._token.get = (requestProperties, callback) => {    
   //check the id is valid
       const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
       if (id) {
           // lookup the token
           data.read('tokens', id, (err, t) => {
               const token = { ...parseJSON(t) };
               /*
                   { phone: '12345678901', id: 'tokenid', expires: timestamp }
               */
               if (!err && token) {
                   callback(200, token);
               } else {
                   callback(404, {
                       error: 'Token not found',
                   });
               }
           });
       } else {
           callback(400, {
               error: 'Token ID is invalid',
           });
       } 
   
};

// @TODO: Authentication and authorization
handler._token.put = (requestProperties, callback) => {
    const id = typeof (requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;
    const extend = typeof (requestProperties.body.extend) === 'boolean' && requestProperties.body.extend === true ? true : false;

    if (id && extend) {
        data.read('tokens', id, (err, tokenData) => {
            let tokenObject = parseJSON(tokenData);
            if (!err && tokenObject && tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                // store the new updates
                data.update('tokens', id, tokenObject, (err) => {
                    if (!err) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server side!',
                        });
                    }
                });
            
            } else {
                callback(400, {
                    error: 'Token has already expired',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request',
        });
    }

};

//@TODO: Authentication and authorization
handler._token.delete = (requestProperties, callback) => {
    //check the token is valid
        const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
        if (id) {
            // lookup the token
            data.read('tokens', id, (err, t) => {
                const tokenObject = { ...parseJSON(t) };
                /*
                    { phone: '12345678901', id: 'tokenid', expires: timestamp }
                */
                if (!err && tokenObject) {
                    // delete the token
                    data.delete('tokens', id, (err) => {
                        if (!err) {
                            callback(200, {
                                message: 'Token deleted successfully',
                            });
                        } else {
                            callback(500, {
                                error: 'There was a problem in the server side!',
                            });
                        }
                    });
                } else {
                    callback(404, {
                        error: 'Token not found',
                    });
                }
            });
        } else {
            callback(400, {
                error: 'Token ID is invalid',
            });
        } 
    

};

handler._token.verify = (id, phone, callback) => {
    const tokenId = typeof id === 'string' ? id.trim() : false;
    if (!tokenId || tokenId.length !== 20 || !phone) {
        callback(false);
        return;
    }

    data.read('tokens', tokenId, (err, tokenData) => {
        if (!err && tokenData) {
            const tokenObject = parseJSON(tokenData);
            if (tokenObject.phone === phone && tokenObject.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;
