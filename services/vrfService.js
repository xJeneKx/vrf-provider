const fs = require('node:fs');
const sig = require('ocore/signature.js');
const path = require('node:path')
const pathToPrivKey = path.join(__dirname,'../keys/priv_key.pem');
const pathToPubKey = path.join(__dirname,'../keys/pub_key.pem');
const privKey = fs.readFileSync(pathToPrivKey, 'utf-8');
const pubKey = fs.readFileSync(pathToPubKey, 'utf-8');
if (!privKey || !pubKey) {
	throw new Error('priv or pub key not found');
}

function generateProof(unit) {
	return sig.vrfGenerate(unit, privKey).toString();
}

function getPubKey() {
	return pubKey.trim();
}

module.exports = {
	generateProof,
	getPubKey,
}