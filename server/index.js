const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

// Last 20 bytes of addresses:
const balances = {
  "98fc8d0208646aff72c0fc3f9364afca07197867": 100,
  "9fc3bcf0700bde0fd6711b56a45a2edd881c97c0": 50,
  "2fd15acd2818d254bb3c709792bfe9cb38561811": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  try {
    // Obtain signature from client-side app and recover the address from the signature
    const { address, message, recoveryBit, signature, amount, recipient } =
      req.body;

    // Hashing message and converting signature into uint8Array for secp method use.
    const bytes = utf8ToBytes(message);
    const msgHash = keccak256(bytes);
    const sigArray = Object.values(JSON.parse(signature));
    const signatureUint8Array = Uint8Array.from(sigArray);
    const publicKey = secp.recoverPublicKey(msgHash, signatureUint8Array, 0);
    const publicKeyHash = keccak256(publicKey.slice(1));
    const addressRecovered = publicKeyHash.slice(-20);

    // If entered and recovered addresses match, send funds to recipient.
    if (address === toHex(addressRecovered)) {
      setInitialBalance(address);
      setInitialBalance(recipient);

      if (balances[address] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[address] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[address] });
      }
    } else res.status(400).send({ message: "Unable to verify signature!" });
  } catch (ex) {
    console.error(ex);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
