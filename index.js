/*
 * Primary file for API
 *
 */

// Dependencies
import server from './lib/server';
import workers from './lib/workers';

// Declare the app
const app = {};

// Init function
app.init = () => {
  // Start the server
  server.init();

  // Start the workers
  workers.init();
};

// Self executing
app.init();

// Export the app
export default app;
