const fs = require('node:fs/promises');
const path = require('node:path');

const BASE_DIR = path.join(__dirname);
const PLAYER_FILE = BASE_DIR + '/data/players.json';
const GAME_FILE = BASE_DIR + '/data/games.json';

let player_handle;
let game_handle;

let players = [];
let games = [];

async function init() {
	try {
		player_handle = await fs.open(PLAYER_FILE, 'w+');

		let data = await fs.readFile(player_handle, { encoding: 'utf-8' });
		if (data !== '') players = JSON.parse(data);

		console.log('Player data loaded');
	} catch (err) {
		console.log(err);
		return false;
	}

	try {
		game_handle = await fs.open(GAME_FILE, 'w+');

		let data = await fs.readFile(game_handle, { encoding: 'utf-8' });
		if (data !== '') games = JSON.parse(data);

		console.log('Game data loaded');
	} catch (err) {
		console.log(err);
		return false;
	}
	
	return true;
}

async function addPlayer(player) {
	let temp = [player, ...players];
	try {
		await fs.writeFile(player_handle, JSON.stringify(temp));
		players = temp;
	} catch (err) {
		console.error(err);
	}
}

async function addGame(game) {
	let temp = [game, ...games];
	try {
		await fs.writeFile(game_handle, JSON.stringify(temp));
		games = temp;
	} catch (err) {
		console.error(err);
	}
}

module.exports = { players, games, init, addPlayer, addGame };