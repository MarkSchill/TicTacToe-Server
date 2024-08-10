const fs = require('fs-extra');
const path = require('node:path');

const BASE_DIR = path.join(__dirname);
const PLAYER_FILE = BASE_DIR + '/data/players.json';
const GAME_FILE = BASE_DIR + '/data/games.json';

let players = [];
let games = [];

async function init() {
	try {
		const player_data = await fs.readJson(PLAYER_FILE);
		players = [...player_data, ...players];
		console.log('Player data loaded');

		games = await fs.readJson(GAME_FILE);
		console.log('Game data loaded');
	} catch (err) {
		console.error('Failed to load data:')
		console.error(err);
		return false;
	}
	
	return true;
}

async function addPlayer(player) {
	const playerExists = (p) => p.email == player.email;
	if (players.find(playerExists) !== undefined) {
		console.error(`Duplicate value detected when saving ${JSON.stringify(player)}`);
		return false;
	}

	try {
		players.push(player);
		await fs.writeJson(PLAYER_FILE, players);
	} catch (err) {
		console.error(err);

		return false;
	}

	return true;
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