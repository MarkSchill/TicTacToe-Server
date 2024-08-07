const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const { body, matchedData, validationResult } = require('express-validator');

const BASE_DIR = path.join(__dirname);

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

let players = [];

try {
    const data = fs.readFileSync(BASE_DIR + '/data/players.json');
    players = JSON.parse(data);
} catch (err) {
    console.error('Failed to open the players.json file.');
}

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

// Enable cross origin resource sharing
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().none());

// Enable express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    genid: function (req) {
        return uuidv4();
    },
}));

app.get('/', (req, res, next) => {
    res.status(200).json({});
});

app.get('/lobby', (req, res, next) => {
    res.status(200).json(players);
});

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

app.post('/register', body(['username', 'email']).notEmpty().escape(), (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        if (registerUser(req, data)) {
            return res.redirect('/?status=success');
        }

        return res.send(`Hello, ${data.username}!`);
    }

    res.send({ errors: result.array() });
    // res.redirect(`/?${encodeURIComponent('error=Failed to register user')}`);
});

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})