/*
* Title: Environments Handler
* Description: Handle all environment related things
* Date: 10 May, 2026
*/

// module scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'thisIsASecretKeyStaging',
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'thisIsASecretKeyProduction',
};

environments.development = {
    port: 3000,
    envName: 'development',
    secretKey: 'thisIsASecretKeyDevelopment',
};

// determine which environment was passed
const currentEnvironment = typeof process.env.NODE_ENV === 'string'
    ? process.env.NODE_ENV.toLowerCase()
    : 'staging';

// export corresponding environment object
const environmentToExport = typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;