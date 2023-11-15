const { getMyAddress } = require("./dbService");
const { sendData, sendMultiPayment } = require("headless-obyte");

async function postData(name, value) {
	const opts = {
		payload: { [name]: value }
	};
	
	return await sendData(opts);
}

async function postResponseForVRF({ id, proof, error, toAddress }) {
	const myAddress = await getMyAddress();
	const opts = {}
	const payload = { id };
	if (proof) {
		payload.proof = proof;
	} else {
		payload.error = error;
	}
	
	opts.paying_addresses = [myAddress];
	opts.amount = 10000;
	opts.toAddress = toAddress;
	opts.messages = [
		{
			app: 'data',
			payload_location: 'inline',
			payload: payload,
		}
	]
	
	const { unit } = await sendMultiPayment(opts)
	return unit;
}

module.exports = {
	postResponseForVRF,
	postData,
}