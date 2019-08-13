const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const pubKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log('<privateKey> : ', privateKey);
console.log('<pubKey> : ', pubKey);