require('headless-obyte');
const eventBus = require("ocore/event_bus");
const { getMyAddress } = require("./services/dbService");

eventBus.once('headless_wallet_ready', async () => {
	const myAddress = await getMyAddress();
	console.log('\n\nYour address:', myAddress);
	process.exit(0);
});