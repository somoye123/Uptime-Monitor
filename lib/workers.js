/*
 * Worker-related tasks
 *
 */

// Dependencies
import path from 'path';
import fs from 'fs';
import _data from './data';
import https from 'https';
import http from 'http';
import helpers from './helpers';
import url from 'url';

// Instantiate the worker module object
const workers = {};

// Timer to execute the worker-process once per minute
workers.loop = () => {
  setInterval(() => {
    workers.gatherAllChecks();
  }, 1000 * 60);
};

// Init script
workers.init = () => {
  // Execute all the checks immediately
  workers.gatherAllChecks();

  // Call the loop so the checks will execute later on
  workers.loop();
};

// Export the module
export default workers;
