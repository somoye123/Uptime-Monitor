/*
 * Primary file for the API
 */

//  Dependencies
import http from 'http';
import url from 'url';
import { StringDecoder } from 'string_decoder';
import config from './config';

// Instantiate the HTTP server
const server = http.createServer((req, res) => unifiedServer(req, res));

// Start the server
server.listen(config.port, () => {
  console.log(
    `The server is up and running on port ${config.port} in ${config.envName} mode.`
  );
});

const unifiedServer = (req, res) => {
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
      typeof router[trimmedPath] !== 'undefined'
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    let data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer,
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

//Define all the handles
const handlers = {};

// Sample handler
handlers.sample = (data, callback) => callback(406, { name: 'sample handler' });

// Not found handler
handlers.notFound = (data, callback) => callback(404);

// Define the request router
const router = {
  sample: handlers.sample,
};
