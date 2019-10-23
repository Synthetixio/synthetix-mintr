[![CircleCI](https://circleci.com/gh/Synthetixio/synthetix-mintr.svg?style=svg)](https://circleci.com/gh/Synthetixio/synthetix-mintr) [![Netlify Status](https://api.netlify.com/api/v1/badges/817f3cc2-ba8e-4d03-8375-00cd0cede28c/deploy-status)](https://app.netlify.com/sites/synthetix-mintr/deploys) [![Discord](https://img.shields.io/discord/413890591840272394.svg?color=768AD4&label=discord&logo=https%3A%2F%2Fdiscordapp.com%2Fassets%2F8c9701b98ad4372b58f13fd9f65f966e.svg)](https://discordapp.com/channels/413890591840272394/)
[![Twitter Follow](https://img.shields.io/twitter/follow/synthetix_io.svg?label=synthetix_io&style=social)](https://twitter.com/synthetix_io)

# Mintr v2

This is the code for the new Synthetix Mintr dApp. https://beta.mintr.synthetix.io

The dApp communicates with the [Synthetix contracts](https://developer.synthetix.io/api/docs/deployed-contracts.html), allowing users to perform the following actions:

- Mint (aka Issue) `sUSD` by locking `SNX`
- Claim rewards of both `SNX` (inflation) and `sUSD` (exchange fees) every week
- Burn `sUSD` to unlock `SNX`
- Transfer `SNX` to other accounts
- Deposit (or withdrawl) `sUSD` into the `Depot` contract, to go in the queue for exchanging with `ETH` at current market price

Mintr v2 supports the following wallet providers:

- Metamask
- Trezor
- Ledger
- Coinbase Wallet

---

> Note: This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
