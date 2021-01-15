/*
 * Request Handlers
 *
 */

// Dependencies
import UsersController from '../controllers/usersController';
import TokensController from '../controllers/tokensController';

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

// Tokens
handlers.tokens = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

export default handlers;
