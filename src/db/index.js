const mongoose = require('mongoose');

const uriDB = process.env.DB_CONNECTION_URL;

const db = mongoose.connect(uriDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
  console.log('Database connection successful');
});

mongoose.connection.on('error', err => {
  console.log(`Database connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Database disconnected');
});

process.on('SIGINT', async () => {
  mongoose.connection.close(() => {
    console.log('Connection for DB disconnected and app terminated');
    process.exit(1);
  });
});

module.exports = db;
