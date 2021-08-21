const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const internalServerError = require('./src/helpers/internalServerError');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(internalServerError);

module.exports = app;
