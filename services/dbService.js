const fs = require('node:fs');
const db = require('ocore/db.js');

let _myAddress = '';

async function getMyAddress() {
	if (_myAddress) return _myAddress;
	const rows = await db.query("SELECT address FROM my_addresses");
	_myAddress = rows[0].address;
	return _myAddress;
}

async function getAuthors(unit) {
	const rows = await db.query("SELECT address FROM unit_authors WHERE unit=?", [unit]);
	return rows.map(row => row.address);
}

async function getMessages(unit) {
	const myAddress = await getMyAddress();
	const rows = await db.query(`
        SELECT app,
               CASE app
                   WHEN 'payment' THEN (SELECT amount
                                        FROM outputs
                                        WHERE unit = ?
                                          AND address = ?
                                          AND asset IS NULL)
                   ELSE payload END pPayload
        FROM messages
        WHERE unit = ?`, [unit, myAddress, unit]);
	
	const result = {};
	for (let { app, pPayload } of rows) {
		result[app] = pPayload
	}
	
	return result;
}

async function saveProofResult(unit_request, unit_response, proof) {
	await db.query("INSERT INTO vrf_result VALUES (?, ?, ?)", [unit_request, unit_response, proof]);
}

module.exports = {
	getMyAddress,
	getMessages,
	getAuthors,
	saveProofResult,
}
