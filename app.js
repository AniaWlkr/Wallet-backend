const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const limiter = require('./src/middleware/limiter');
const internalServerError = require('./src/helpers/internalServerError');

require('dotenv').config();

const { apiLimit, jsonLimit } = require('./src/config/rateLimit.json');
const { swaggerUi, swaggerSpec } = require('./src/helpers/swagger');

const usersRouter = require('./routes/api/users');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: jsonLimit }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/', limiter(apiLimit));
app.use('/api/users', usersRouter);

app.use(internalServerError);

module.exports = app;
