/*jslint node: true */
'use strict';
const eventBus = require('ocore/event_bus');
const headlessWallet = require('headless-obyte');
const device = require('ocore/device.js');
const { payout_address, control_addresses, hub, min_payment } = require("ocore/conf");
require('./dbInit');

const { prepareUnit } = require("./services/dataService");
const { generateProof } = require("./services/vrfService");
const { postResponseForVRF, postPubKey } = require("./services/paymentService");
const { saveProofResult, getMyAddress } = require("./services/dbService");
const { setState, getPubKeyState } = require("./services/stateService");
const { getMyBalanceInBytes } = require("./services/ocoreService");
const { sleep } = require("./helpers/sleep");

eventBus.once('headless_wallet_ready', async () => {
	await sleep(3);
	const balance = await getMyBalanceInBytes();
	if (balance < min_payment) {
		throw new Error(`small balance(${balance} bytes), please refill address: ` + await getMyAddress());
	}
	
	const pubKeyInState = await getPubKeyState();
	if (!pubKeyInState) {
		const unit = await postPubKey();
		await setState('pubkey', '1');
		console.error('pubkey posted:', unit);
	}
	
	console.error('---------------');
	console.error('For add bot use this pairing code:', `${device.getMyDevicePubKey()}@${hub}#1`);
	console.error('To use VRF service in AA, use this address:', await getMyAddress());
	
	eventBus.on('text', async (from_address, text) => {
		text = text.trim();
		if (text === 'ping') {
			device.sendMessageToDevice(from_address, 'text', "pong");
			return;
		}
		
		if (control_addresses.includes(from_address)) {
			if (text === 'address') {
				device.sendMessageToDevice(from_address, 'text', await getMyAddress());
			} else if (text === 'balance') {
				device.sendMessageToDevice(from_address, 'text', (await getMyBalanceInBytes()) / 1e9 + ' GBYTE');
			} else if (text === 'withdraw') {
				const balanceForWithdraw = (await getMyBalanceInBytes()) - min_payment;
				
				try {
					const { unit } = await headlessWallet.sendPaymentUsingOutputs(null, [
						{ amount: balanceForWithdraw, address: payout_address },
					], await getMyAddress());
					
					device.sendMessageToDevice(from_address, 'text', 'done: ' + unit);
				} catch (e) {
					device.sendMessageToDevice(from_address, 'text', 'error: ' + e);
				}
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
			id: unit,
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
