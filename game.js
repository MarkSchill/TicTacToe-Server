const express = require('express');

const app = express();

app.on('mount', (parent) => console.log('Game app mounted'));

module.exports = { app };