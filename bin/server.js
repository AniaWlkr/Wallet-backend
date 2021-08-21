const app = require('../app');
const db = require('../src/db');
const normalizePort = require('normalize-port');

const PORT = normalizePort(process.env.PORT || '3000');

(async db => {
  try {
    await db;
    app.listen(PORT, async () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.log(`Server not running. Error: ${error.message}`);
  }
})(db);
