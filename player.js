const express = require('express');
const { body, matchedData, validationResult } = require('express-validator');

const db = require('./db');

const app = express();

app.get('/:id', (req, res, next) => {
    let player = db.players.find((p) => p.id === req.params.id);
    res.status(200).json(player);
});

app.post('/new', body(['username', 'email']).notEmpty().escape(), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(500).json({ errors: result.array() });
    }

    const data = matchedData(req);

    const player = {
        id: req.session.id,
        username: data.username,
        email: data.email,
    };

    db.addPlayer(player)
        .then((success) => {
            if (success) {
                req.session.registered = true;
                res.status(200).json({ errors: [], success: true });
            } else {
                res.status(500).json({ errors: ['Failed'], success: false });
            }
        })
        .catch((error) => res.status(500).json({ errors: ['Failed'], success: false }));
});

app.on('mount', (parent) => {
    console.log('Player app mounted');
});

module.exports = { app };