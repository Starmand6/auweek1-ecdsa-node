const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp.utils.randomPrivateKey();
console.log("Private Key: ", toHex(privateKey));
const publicKey = secp.getPublicKey(privateKey);
const publicKeyHash = keccak256(publicKey.slice(1));
const address = publicKeyHash.slice(-20);
console.log("Public Key: ", toHex(publicKey));
console.log("Address: ", toHex(address));

// Make sure to input the exact same message and recoveryBit into the Wallet form on front end:
const message = "WAGMI";
const recoveryBit = 0;
const bytes = utf8ToBytes(message);
const hash = keccak256(bytes);

async function generateSig() {
  const uint8ArraySig = await secp.sign(hash, privateKey, recoveryBit);
  const stringifiedSig = JSON.stringify(uint8ArraySig);
  console.log("Signature: ", stringifiedSig);
}

generateSig();
