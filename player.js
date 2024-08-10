const express = require('express');
const { body, matchedData, validationResult } = require('express-validator');
const { requireLogin } = require('./secure');

const db = require('./db');

const app = express();

app.get('/:id', requireLogin, (req, res, next) => {
    let player = db.players.find((p) => p.id === req.params.id);
    if (player === undefined) {
        res.status(404);
    } else {
        res.status(200);
    }

    res.json(player);
});

app.post('/register', body(['email', 'password']).notEmpty().escape(), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(500).json({ errors: result.array() });
    }

    const data = matchedData(req);

    const player = {
        email: data.email,
        password: data.password,
        id: req.session.id,
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

app.post('/login', body(['email', 'password']).notEmpty().escape(), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(500).json({ errors: result.array() });
    }

    const data = matchedData(req);
});

app.on('mount', (parent) => {
    console.log('Player app mounted');
});

module.exports = { app };