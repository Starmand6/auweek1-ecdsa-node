import server from "./server";
import { useState } from "react";

function Wallet({ address, setAddress, balance, setBalance }) {

  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance},
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Wallet Info</h1>

      <label>
        Address
        <input placeholder="Enter your wallet address (without the 0x) for verification:" value={address} onChange={onChange}></input>
      </label>

      <div className="address">Address: {address.slice(0,20)}...</div>

      <div className="balance">Balance: {balance}</div>
      </div>
  );
}

export default Wallet;
