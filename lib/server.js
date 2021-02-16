/*
 * Server-related tasks
 *
 */

//  Dependencies
import http from 'http';
import https from 'https';
import url from 'url';
import { StringDecoder } from 'string_decoder';
import config from './config';
import fs from 'fs';
import handlers from './handler';
import helpers from './helpers';
import path from 'path';

// Instantiate the server module object
const server = {};

// Instantiate the HTTP server
server.httpServer = http.createServer((req, res) =>
  server.unifiedServer(req, res)
);

// Instantiate the HTTPS server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
};
server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) =>
  server.unifiedServer(req, res)
);

server.unifiedServer = (req, res) => {
  // Parse request url
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  //Get the headers as an object
  const headers = req.headers;

  // Get the payload,if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => (buffer += decoder.write(data)));
  req.on('end', () => {
    buffer += decoder.end();

    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
    let chosenHandler =
      typeof server.router[trimmedPath] !== 'undefined'
        ? server.router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    let data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code returned from the handler, or set the default status code to 200
      statusCode = typeof statusCode === 'number' ? statusCode : 200;

      // Use the payload returned from the handler, or set the default payload to an empty object
      payload = typeof payload === 'object' ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log('Returning this response: ', statusCode, payloadString);
    });
  });
};

// Define the request router
server.router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  checks: handlers.checks,
};

server.init = () => {
  // Start the http server
  server.httpServer.listen(config.httpPort, () => {
    console.log(
      '\x1b[36m%s\x1b[0m',
      `The server is up and running on port ${config.httpPort} in ${config.envName} mode.`
    );
  });

  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, () =>
    console.log(
      '\x1b[35m%s\x1b[0m',
      'The HTTPS server is running on port ' + config.httpsPort
    )
  );
};
// Export the module
export default server;
