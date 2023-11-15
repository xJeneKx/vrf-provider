const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const process = require('node:process');
const { join } = require("path");
const pathToFolder = join(__dirname, 'keys');

if (!fs.existsSync(pathToFolder)) {
	fs.mkdirSync(pathToFolder);
}

if (fs.existsSync(join(pathToFolder, 'priv_key.pem')) ||
	fs.existsSync(join(pathToFolder, 'pub_key.pem'))) {
	console.error('keys already exists');
	process.exit(1);
}

// openssl genrsa -out priv_key.pem 2048
const args = ['genrsa', '-out', join(pathToFolder, 'priv_key.pem'), '2048'];
const result = spawnSync('openssl', args);
if (result.error) {
	console.error(result.error);
	process.exit(1);
}

// openssl rsa -in priv_key.pem -outform PEM -pubout -out pub_key.pem
const args2 = ['rsa', '-in', join(pathToFolder, 'priv_key.pem'), '-outform', 'PEM', '-pubout', '-out', join(pathToFolder, 'pub_key.pem')];
const result2 = spawnSync('openssl', args2);
if (result2.error) {
	console.error(result2.error);
	process.exit(1);
}

console.log('done');
process.exit(0);

