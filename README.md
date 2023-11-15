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
Copy the address and fund it using Obyte wallet. 100000 bytes (0.0001 GB)

### Run
```
node start.js
```


## Help

tech channel on discord https://discord.obyte.org.

