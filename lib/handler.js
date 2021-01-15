/*
 * Request Handlers
 *
 */

// Dependencies
import _data from './data';
import helpers from './helpers';
import UsersController from '../controllers/usersController';

//Define all the handles
const handlers = {};

// Ping handler
handlers.ping = (data, callback) => callback(200);

// Not found handler
handlers.notFound = (data, callback) => callback(404);

// Users
handlers.users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the users methods
handlers._users = UsersController;


// Required data: phone
handlers._users.delete = (data, callback) => {
  // Check that phone number is valid
  const phone =
    typeof data.queryStringObject.phone == 'string' &&
    data.queryStringObject.phone.trim().length == 11
      ? data.queryStringObject.phone.trim()
      : false;
  if (phone) {
    // Lookup the user
    _data.read('users', phone, function (err, data) {
      if (!err && data) {
        _data.delete('users', phone, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: 'Could not delete the specified user' });
          }
        });
      } else {
        callback(400, { Error: 'Could not find the specified user.' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

export default handlers;
