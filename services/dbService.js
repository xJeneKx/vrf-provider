const fs = require('node:fs');
const db = require('ocore/db.js');
const { min_payment } = require("ocore/conf");

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

async function isValidPayment(unit) {
	const myAddress = await getMyAddress();
	const rows = await db.query(`SELECT 1
                                 FROM outputs
                                 WHERE unit = ?
                                   AND address = ?
                                   AND asset IS NULL
                                   AND amount >= ?;`, [unit, myAddress, min_payment]);
	
	return !!rows.length;
}

async function saveProofResult(unit_request, unit_response, proof) {
	await db.query("INSERT INTO vrf_result VALUES (?, ?, ?)", [unit_request, unit_response, proof]);
}

module.exports = {
	getMyAddress,
	isValidPayment,
	getAuthors,
	saveProofResult,
}
