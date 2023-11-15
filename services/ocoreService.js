const { readAADefinitions } = require("ocore/aa_addresses");
const { getMyAddress } = require("./dbService");
const { readBalance } = require("ocore/wallet");

async function isAA(address) {
	const rows = await readAADefinitions([address]);
	return rows.length > 0;
}

async function getMyBalanceInBytes() {
	const myAddress = await getMyAddress();
	const balance = await readBalance(myAddress);
	return balance.base.total || 0;
}

module.exports = {
	isAA,
	getMyBalanceInBytes,
};
