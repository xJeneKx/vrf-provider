/*jslint node: true */
'use strict';
const eventBus = require('ocore/event_bus');
const headlessWallet = require('headless-obyte');
const device = require('ocore/device.js');
const conf = require('ocore/conf');
require('./dbInit');

const { prepareUnit } = require("./services/dataService");
const { generateProof, getPubKey } = require("./services/vrfService");
const { postResponseForVRF, postData } = require("./services/paymentService");
const { saveProofResult, getMyAddress } = require("./services/dbService");
const { getState, setState } = require("./services/stateService");
const { getMyBalanceInBytes } = require("./services/ocoreService");


eventBus.once('headless_wallet_ready', async () => {
	const balance = await getMyBalanceInBytes();
	if (balance < 100000) {
		throw new Error('small balance, please refill address: ' + await getMyAddress());
	}
	
	const pubKeyPosted = !!(await getState('pubkey'));
	if (!pubKeyPosted) {
		const unit = await postData('pubkey', getPubKey());
		await setState('pubkey', '1');
		console.error('pubkey posted:', unit);
	}
	
	eventBus.on('text', async (from_address, text) => {
		text = text.trim();
		if (text === 'ping') {
			device.sendMessageToDevice(from_address, 'text', "pong");
		}
		
		if (conf.control_addresses.includes(from_address)) {
			if (text === 'address') {
				const myAddress = await getMyAddress();
				device.sendMessageToDevice(from_address, 'text', myAddress);
				
			} else if (text === 'balance') {
				device.sendMessageToDevice(from_address, 'text', await getMyBalanceInBytes() + ' bytes');
			}
		}
	});
});

eventBus.on('new_my_transactions', async (arrUnits) => {
	for (let unit of arrUnits) {
		const result = await prepareUnit(unit);
		if (result.change) continue;
		
		let proof;
		if (!result.error) {
			proof = generateProof(unit);
		}
		
		const unitResponse = await postResponseForVRF({
			id: result.id,
			proof,
			error: result.error,
			toAddress: result.address
		});
		
		await saveProofResult(unit, unitResponse, proof || result.error);
		console.error('result sent', unit, '->', unitResponse);
	}
});


process.on('unhandledRejection', up => {
	throw up;
});
