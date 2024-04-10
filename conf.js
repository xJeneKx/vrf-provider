/*jslint node: true */
"use strict";
exports.port = null;
//exports.myUrl = 'wss://mydomain.com/bb';
exports.bServeAsHub = false;
exports.bLight = true;

exports.storage = 'sqlite';
exports.bNoPassphrase = true;

// TOR is recommended. Uncomment the next two lines to enable it
//exports.socksHost = '127.0.0.1';
//exports.socksPort = 9050;

exports.hub = process.env.testnet ? 'obyte.org/bb-test' : 'obyte.org/bb';
exports.deviceName = 'VRF provider';
exports.permanent_pairing_secret = '*'; // * allows to pair with any code, the code is passed as 2nd param to the pairing event handler
exports.control_addresses = [process.env.control_address || ''];
exports.payout_address = process.env.payout_address || '';
exports.spend_unconfirmed = 'all';

exports.bIgnoreUnpairRequests = false;
exports.bSingleAddress = true;
exports.bStaticChangeAddress = true;
exports.KEYS_FILENAME = 'keys.json';

// emails
exports.admin_email = '';
exports.from_email = '';


exports.min_payment = 50000; // in bytes
exports.VRF_registry = 'AOIMCWGHR5NI4UI4N4UENWDDJ7SR5W5C'; // release VRF registry address
