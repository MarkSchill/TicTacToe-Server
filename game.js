const express = require('express');

const app = express();

app.on('mount', (parent) => console.log('Game mounted'));

module.exports = { app };