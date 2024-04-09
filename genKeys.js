const fs = require('node:fs');
const process = require('node:process');
const { generateKeyPairSync } = require('node:crypto');
const { join } = require('path');
const pathToFolder = join(__dirname, 'keys');
const pathToPrivKey = join(pathToFolder, 'priv_key.pem');
const pathToPubKey = join(pathToFolder, 'pub_key.pem');

if (!fs.existsSync(pathToFolder)) {
	fs.mkdirSync(pathToFolder);
}

if (fs.existsSync(pathToPrivKey) || fs.existsSync(pathToPubKey)) {
	console.error('keys already exists');
	process.exit(1);
}

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
	modulusLength: 2048,
});

fs.writeFileSync(pathToPrivKey, privateKey.export({
	type: 'pkcs1',
	format: 'pem',
}));

fs.writeFileSync(pathToPubKey, publicKey.export({
	type: 'spki',
	format: 'pem',
}));

console.log('done');
