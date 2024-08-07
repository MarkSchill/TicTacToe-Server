const express = require('express');
const cors = require('cors');
const multer = require('multer');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

const { init } = require('./db');

const player = require('./player');
const game = require('./game');
const admin = require('./admin');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

if (!(await init())) {
    process.exit();
}

app.use(cors()); // Enable cross origin resource sharing
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

app.use('/admin', admin.app);
app.use('/game', game.app);
app.use('/player', player.app);

app.get('/', (req, res, next) => {
    res.status(200).json({});
});

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})