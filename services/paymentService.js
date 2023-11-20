const { getMyAddress } = require("./dbService");
const { sendData, sendMultiPayment } = require("headless-obyte");
const { VRF_registry } = require("ocore/conf");
const { getPubKey } = require("./vrfService");


async function postPubKey() {
	const opts = {
		payload: { pubkey: getPubKey() }
	};
	
	const unit = await sendData(opts);
	const payload = {
		type: 'add_me',
		pubkey_unit: unit,
	};
	
	return sendDataToAddress(payload, VRF_registry);
}

async function postResponseForVRF({ id, proof, error, toAddress }) {
	const payload = { id };
	if (proof) {
		payload.proof = proof;
	} else {
		payload.error = error;
	}
	
	return sendDataToAddress(payload, toAddress);
}

async function sendDataToAddress(data, toAddress) {
	const myAddress = await getMyAddress();
	const opts = {}
	opts.paying_addresses = [myAddress];
	opts.amount = 10000;
	opts.to_address = toAddress;
	opts.messages = [
		{
			app: 'data',
			payload_location: 'inline',
			payload: data,
		}
	]
	
	const { unit } = await sendMultiPayment(opts);
	return unit;
} 

module.exports = {
	postResponseForVRF,
	postPubKey,
}