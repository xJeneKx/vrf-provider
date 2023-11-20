const db = require('ocore/db');

async function getState(name) {
	const rows = await db.query(`SELECT value
                                 FROM vrf_state
                                 WHERE name = ?`, [name]);
	return rows[0]?.value || null;
}

async function getPubKeyState() {
	const pubkey = await getState('pubkey');
	return pubkey ? Number(pubkey) : null;
}

async function setState(name, value) {
	await db.query(`INSERT OR
                    REPLACE INTO vrf_state (name, value)
                    VALUES (?, ?)`, [name, value]);
}

module.exports = {
	getState,
	setState,
	getPubKeyState,
}