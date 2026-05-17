/*
* Title: User Handler
* Description: Handle user related routes
* Date: 09 May, 2026
*/
// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
// module scaffolding
const handler = {};
const tokenHandler = require('./tokenHandler');

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        const methodHandler = handler._user[requestProperties.method];
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
handler._user = {};

//@TODO: Authentication and authorization
handler._user.post = (requestProperties, callback) => {  
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof (requestProperties.body.tosAgreement) === 'boolean' && requestProperties.body.tosAgreement === true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user doesn't already exist
        data.read('users', phone, (err, user) => {
            if (err) {
                const hashedPassword = hash(password);
                if (!hashedPassword) {
                    callback(500, {
                        error: 'Could not hash password',
                    });
                    return;
                }
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hashedPassword,
                    tosAgreement,
                };
                // store the user to database
                data.create('users', phone, userObject, err => {
                    if (!err) {
                        callback(200, {
                            message: 'User created successfully',
                        });
                    } else {
                        callback(500, {
                            error: 'could not create user',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in server side',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

handler._user.get = (requestProperties, callback) => {    
    //check the phone number is valid
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if (phone) {
        // verify the token
        const rawToken = requestProperties.headersObject.token || requestProperties.headersObject['x-token'] || requestProperties.headersObject.authorization;
        let token = typeof rawToken === 'string' ? rawToken.trim() : false;
        if (token && token.toLowerCase().startsWith('bearer ')) {
            token = token.slice(7).trim();
        }

        tokenHandler._token.verify(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {
                // lookup the user
                data.read('users', phone, (err, u) => {
                const user = { ...parseJSON(u) };
                /*
                     { name: 'John Doe', phone: '12345678901', password: 'hashedpassword', tosAgreement: true }
                */
                if (!err && user) {
                     delete user.password;
                    callback(200, user);
                } else {
                    callback(404, {
                        error: 'User not found',
                    });
                }
            });
            } else {
                callback(403, {
                    error: 'Missing required token in header, or token is invalid',
                });
            }
        });
        
        
    } else {
        callback(400, {
            error: 'Phone number is invalid',
        });
    } 
};

//@TODO: Authentication and authorization
handler._user.put = (requestProperties, callback) => {
    //check the phone number is valid
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof (requestProperties.body.tosAgreement) === 'boolean' && requestProperties.body.tosAgreement === true ? true : false;

    if (phone) {
        const rawToken = requestProperties.headersObject.token || requestProperties.headersObject['x-token'] || requestProperties.headersObject.authorization;
        let token = typeof rawToken === 'string' ? rawToken.trim() : false;
        if (token && token.toLowerCase().startsWith('bearer ')) {
            token = token.slice(7).trim();
        }

        tokenHandler._token.verify(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {
                if (firstName || lastName || password) {
                    // lookup the user
                    data.read('users', phone, (err, u) => {
                        if (!err && u) {
                            // update the user
                            const user = { ...parseJSON(u) };
                            if (firstName) {
                                user.firstName = firstName;
                            }
                            if (lastName) {
                                user.lastName = lastName;
                            }
                            if (password) {
                                user.password = hash(password);
                            }
                            if (tosAgreement !== undefined) {
                                user.tosAgreement = tosAgreement;
                            }
                            // update the user in the database
                            data.update('users', phone, user, err => {
                                if (!err) {
                                    callback(200, {
                                        message: 'User updated successfully',
                                    });
                                } else {
                                    callback(500, {
                                        error: 'Could not update user',
                                    });
                                }
                            });
                        } else {
                            callback(404, {
                                error: 'User not found',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'No valid updates provided',
                    });
                }
            } else {
                callback(403, {
                    error: 'Missing required token in header, or token is invalid',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Phone number is invalid',
        });
    }

};

//@TODO: Authentication and authorization
handler._user.delete = (requestProperties, callback) => {
    //check the phone number is valid
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if (phone) {
        const rawToken = requestProperties.headersObject.token || requestProperties.headersObject['x-token'] || requestProperties.headersObject.authorization;
        let token = typeof rawToken === 'string' ? rawToken.trim() : false;
        if (token && token.toLowerCase().startsWith('bearer ')) {
            token = token.slice(7).trim();
        }

        tokenHandler._token.verify(token, phone, (tokenIsValid) => {
            if (tokenIsValid) {
                // lookup the user
                data.read('users', phone, (err, u) => {
                    if (!err && u) {
                        // delete the user
                        data.delete('users', phone, err => {
                            if (!err) {
                                callback(200, {
                                    message: 'User deleted successfully',
                                });
                            } else {
                                callback(500, {
                                    error: 'Could not delete user',
                                });
                            }
                        });
                    } else {
                        callback(404, {
                            error: 'User not found',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Missing required token in header, or token is invalid',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request',
        });
    }

};

module.exports = handler;
