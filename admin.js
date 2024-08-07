const express = require('express');

const app = express();

app.on('mount', (parent) => console.log('Admin app mounted'));

module.exports = { app };