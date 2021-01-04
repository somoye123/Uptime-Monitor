/*
 * Primary file for the API
 */

//  Dependencies
import http from 'http';
import url from 'url';

// Server respond to all request with a string
const server = http.createServer(function (req, res) {
  res.end('Hello World|\n');
});

// start the server, and have it listen on port 3000
server.listen(3000, function () {
  console.log('The server is listening on port 3000 now');
});
