const db = require('ocore/db.js');

async function init() {
	await db.query(`
        CREATE TABLE IF NOT EXISTS vrf_result
        (
            unit_request  VARCHAR(44) NOT NULL PRIMARY KEY,
            unit_response VARCHAR(44) NOT NULL,
            proof         TEXT
        )`
	);
	await db.query(`
		CREATE TABLE IF NOT EXISTS vrf_state
		(
		    name VARCHAR(255) NOT NULL PRIMARY KEY,
			value VARCHAR(255) NOT NULL
		)
	`);
}
init();
