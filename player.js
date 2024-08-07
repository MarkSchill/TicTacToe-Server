const fs = require('node:fs');
const express = require('express');
const { body, matchedData, validationResult } = require('express-validator');

const app = express();

function loadPlayers(req, data) {
	try {
		const data = fs.readFileSync(BASE_DIR + '/data/players.json');
		return JSON.parse(data);
	} catch (err) {
		console.error('Failed to open the players.json file.');
	}

	return null;
}

// TODO: Need to add a check for existing users with the same email / name
function registerUser(req, data) {
    players.push({
        id: req.session.id,
        username: data.username,
        email: data.email,
    });
    req.session.registered = true;

    fs.writeFile(BASE_DIR + '/data/players.json', JSON.stringify(players), err => {
        if (err) {
            console.error(err);
        }
    });

    return true;
}

app.get('/:id', (req, res, next) => {
    let player = players.find((p) => p.id === req.params.id);
    res.status(200).json(player);
});

app.post('/join', body(['username', 'email']).notEmpty().escape(), (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        if (registerUser(req, data)) {
            return res.redirect('/?status=success');
        }

        return res.send(`Hello, ${data.username}!`);
    }

    res.send({ errors: result.array() });
});

app.on('mount', (parent) => console.log('Player mounted'));

module.exports = { app };