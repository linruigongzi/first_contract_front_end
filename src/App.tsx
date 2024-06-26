import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from './hooks/useTonConnect';
import { fromNano } from '@ton/core';

function App() {

  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    sendIncrement,
    sendDeposit,
    sendWithdrawRequest,
    contract_balance,
  } = useMainContract();

  const { connected } = useTonConnect();

  return (
    <div className='App'>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>
          <b>Our Contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          {contract_balance && <div className='Hint'>{fromNano(contract_balance)}</div>}
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>

        <div className='Card'>
          <b>Rencent Sender</b>
          <div>{recent_sender?.toString({testOnly: true})}</div>
        </div>

        <div className='Card'>
          <b>Owner Address</b>
          <div>{owner_address?.toString({testOnly: true})}</div>
        </div>

        {connected && (
          <a onClick={() => {
            sendIncrement()
          }}>
            Increment by 3
          </a>
        )}

        <br />

        {connected && (
          <a onClick={() => {
            sendDeposit()
          }}>
            Request deposit of 0.12 TON
          </a>
        )}

        <br />

        {connected && (
          <a onClick={() => {
            sendWithdrawRequest()
          }}>
            Request 0.1 TON withdrawal
          </a>
        )}
      </div>
    </div>
  );
}

export default App
