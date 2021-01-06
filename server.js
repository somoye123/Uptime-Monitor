/*
 * Primary file for the API
 */

//  Dependencies
import http from 'http';
import url from 'url';
import { StringDecoder } from 'string_decoder';

// Server respond to all request with a string
const server = http.createServer((req, res) => {
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


  res.end('Hello World|\n');

  // Log the request/response
  console.log('Request received on path: ' + trimmedPath);
});

// start the server, and have it listen on port 3000
server.listen(3000, () =>
  console.log('The server is listening on port 3000 now')
);
