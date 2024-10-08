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
        id: req.session.id,
        email: data.email,
        password: data.password,
    };

    db.addPlayer(player)
        .then((success) => {
            if (success) {
                // req.session.registered = true;
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

    db.authenticate(data)
        .then((success) => {
            if (success) {
                req.session.authenticated = true;
                res.status(200).json({ errors: [], msg: 'Login successful' });
            } else {
                res.status(200).json({ errors: ['Invalid email or password'] });
            }
        })
        .catch((error) => res.status(501));
});

app.on('mount', (parent) => {
    console.log('Player app mounted');
});

module.exports = { app };