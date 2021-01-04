/*
 * Primary file for the API
 */

//  Dependencies
const http = require('http');
const url = require('url');

// Server respond to all request with a string
const server = http.createServer(function (req, res) {
  res.end('Hello World|\n');
});
