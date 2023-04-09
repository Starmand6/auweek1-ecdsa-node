import { useState } from "react";
import server from "./server";

function Transfer({ balance, setBalance, address }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [recoveryBit, setRecoveryBit] = useState(0);
  const [signature, setSignature] = useState("");
  const [verified] = useState(false);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        address: address,
        message: message,
        signature: signature,
        recoveryBit: recoveryBit,
        amount: parseInt(sendAmount),
        recipient: recipient,
      });
      setBalance(balance);
    } catch (e) {
      alert(e.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>

      <h1>Send Transaction</h1>

      <div className="address">Sender Address: {address}</div>

      <div className="balance">Balance: {balance}</div>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Message
        <input
          placeholder="Type the message you used to make your offline signature:"
          value={message}
          onChange={setValue(setMessage)}
        ></input>
      </label>

      <label>
        Recovery Bit
        <input
          placeholder="Type your recovery bit (number like 0 or 1)"
          value={recoveryBit}
          onChange={setValue(setRecoveryBit)}
        ></input>
      </label>

      <label>
        Signature
        <input
          placeholder="Enter stringified signature generated offline here:"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>
      
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
