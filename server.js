/*
 * Primary file for the API
 */

//  Dependencies
import http from 'http';
import url from 'url';

// Server respond to all request with a string
const server = http.createServer((req, res) => {
  // Parse request url
  let parsedUrl = url.parse(req.url, true);

  // Get the path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');

  res.end('Hello World|\n');
});

// start the server, and have it listen on port 3000
server.listen(3000, () =>
  console.log('The server is listening on port 3000 now')
);
