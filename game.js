const express = require('express');
const { requireLogin } = require('./secure');

const app = express();

app.post('/new', requireLogin, (req, res, next) => {

});

app.on('mount', (parent) => console.log('Game app mounted'));

module.exports = { app };