// config.js
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  environment: process.env.NODE_ENV,
  privateKeys: process.env.PKS,
  wallets: process.env.WALLETS,
  sendTo: process.env.SENDTO,
  sendToPk: process.env.SENDTOPK,
};