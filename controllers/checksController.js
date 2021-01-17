// Dependencies
import _data from '../lib/data';
import helpers from '../lib/helpers';
import config from '../lib/config';
import { verifyToken } from './tokensController';

const Controller = {};

// Checks - post
// Required data: protocol,url,method,successCodes,timeoutSeconds
// Optional data: none
Controller.post = (data, callback) => {
  // Validate inputs
  const protocol =
    typeof data.payload.protocol == 'string' &&
    ['https', 'http'].indexOf(data.payload.protocol) > -1
      ? data.payload.protocol
      : false;
  const url =
    typeof data.payload.url == 'string' && data.payload.url.trim().length > 0
      ? data.payload.url.trim()
      : false;
  const method =
    typeof data.payload.method == 'string' &&
    ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1
      ? data.payload.method
      : false;
  const successCodes =
    typeof data.payload.successCodes == 'object' &&
    data.payload.successCodes instanceof Array &&
    data.payload.successCodes.length > 0
      ? data.payload.successCodes
      : false;
  var timeoutSeconds =
    typeof data.payload.timeoutSeconds == 'number' &&
    data.payload.timeoutSeconds % 1 === 0 &&
    data.payload.timeoutSeconds >= 1 &&
    data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;
  if (protocol && url && method && successCodes && timeoutSeconds) {
    // Get token from headers
    const token =
      typeof data.headers.token == 'string' ? data.headers.token : false;

    // Lookup the user phone by reading the token
    _data.read('tokens', token, (err, tokenData) => {
      if (!err && tokenData) {
        const userPhone = tokenData.phone;

        // Lookup the user data
        _data.read('users', userPhone, (err, userData) => {
          if (!err && userData) {
            const userChecks =
              typeof userData.checks == 'object' &&
              userData.checks instanceof Array
                ? userData.checks
                : [];
            // Verify that user has less than the number of max-checks per user
            if (userChecks.length < config.maxChecks) {
              // Create random id for check
              const checkId = helpers.createRandomString(20);

              // Create check object including userPhone
              const checkObject = {
                id: checkId,
                userPhone,
                protocol,
                url,
                method,
                successCodes,
                timeoutSeconds,
              };

              // Save the object
              _data.create('checks', checkId, checkObject, (err) => {
                if (!err) {
                  // Add check id to the user's object
                  userData.checks = userChecks;
                  userData.checks.push(checkId);

                  // Save the new user data
                  _data.update('users', userPhone, userData, (err) => {
                    if (!err) {
                      // Return the data about the new check
                      callback(200, checkObject);
                    } else {
                      callback(500, {
                        Error: 'Could not update the user with the new check.',
                      });
                    }
                  });
                } else {
                  callback(500, { Error: 'Could not create the new check' });
                }
              });
            } else {
              callback(400, {
                Error:
                  'The user already has the maximum number of checks (' +
                  config.maxChecks +
                  ').',
              });
            }
          } else {
            callback(403);
          }
        });
      } else {
        callback(403);
      }
    });
  } else {
    callback(400, { Error: 'Missing required inputs, or inputs are invalid' });
  }
};

// Checks - get
// Required data: id
// Optional data: none
Controller.get = (data, callback) => {
  // Check that id is valid
  const id =
    typeof data.queryStringObject.id == 'string' &&
    data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    // Lookup the check
    _data.read('checks', id, (err, checkData) => {
      if (!err && checkData) {
        // Get the token that sent the request
        const token =
          typeof data.headers.token == 'string' ? data.headers.token : false;
        // Verify that the given token is valid and belongs to the user who created the check
        verifyToken(token, checkData.userPhone, (tokenIsValid) => {
          // Return check data
          tokenIsValid ? callback(200, checkData) : callback(403);
        });
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: 'Missing required field, or field invalid' });
  }
};

export default Controller;
