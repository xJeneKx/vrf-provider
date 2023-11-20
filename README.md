# VRF provider (obyte)

## Setup
### install and key gen
```
npm install
node genKeys.js
cp .env.mainnet .env
```

### Set your addresse
Open .env and change \
control_address - your device address from Obyte wallet \
payout_address - you wallet address for receive payments

### Adding money to provider wallet
```
node getMyAddress.js
```
Copy the address and fund it using Obyte wallet. 1000000 bytes (0.001 GB)

### Run
```
node start.js
```
The console will display the public key for adding the bot, as well as the address for replenishment and use in AA


## Help

tech channel on discord https://discord.obyte.org.

