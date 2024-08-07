const express = require('express');

const app = express();

app.on('mount', (parent) => console.log('Admin mounted'));

module.exports = { app };