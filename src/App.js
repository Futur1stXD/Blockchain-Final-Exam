import React, { useState } from 'react';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import { ethers } from 'ethers';
import Web3 from 'web3';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [stakingAmount] = useState(0);

  const addTask = (newTask) => {
    if (stakeTokens()) {
      setTasks([...tasks, newTask]);
    }
  };

  const markComplete = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    sendMoney();
    setTasks(updatedTasks);
  };


  async function requestAccount() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log('Error connecting...');
      }
    } else {
      alert('MetaMask not detected');
    }
  }

  async function stakeTokens() {
    if (walletAddress && 1000 > 0) {
      const contractABI = [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_stakingPeriod",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_totalRewards",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "calculateRewards",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "distributeRewards",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            }
          ],
          "name": "stake",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "stakedBalances",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "stakedUsers",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "stakingPeriod",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "stakingStartTimes",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalRewards",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "userBalances",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
      try {
        var amountToStake = 10000;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract('0x316808C61411C24c1578E51F356fdC8ebD123649', contractABI, signer);
        const amountInWei = ethers.utils.parseEther(amountToStake.toString());
        const tx = await contract.stake(amountToStake);
        await tx.wait();
        console.log('Stake successful');
        return true;
      } catch (error) {
        console.error('Stake failed:', error);
        return false;
      }
    } else {
      console.log('Please provide a valid staking amount and ensure the wallet is connected.');
    }
    return false;
  }

  const { Web3 } = require('web3');

  const sendMoney = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545"));
    const senderAddress = '0x316808C61411C24c1578E51F356fdC8ebD123649';
    const clientAddress = walletAddress; 
    const amountToSend = '10000';
    const privateKey = '93d1f27d42e82cf6eca33e116f5651751416f98311d13a99ec8d5fbae0396bbb'; 
    try {
      const senderBalance = await web3.eth.getBalance(senderAddress);
      const gasPrice = await web3.eth.getGasPrice();
      const nonce = await web3.eth.getTransactionCount(senderAddress);
      if (senderBalance < amountToSend) {
        console.log("Insufficient balance in the sender's account.");
        return;
      }
      const tx = {
        from: senderAddress,
        to: clientAddress,
        value: amountToSend,
        gas: '21000',
        gasPrice: gasPrice,
        nonce: nonce
      };
      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log('Transaction sent. Transaction hash:', receipt.transactionHash);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="App">
      <div className="App">
        <header className="App-header">
          <button onClick={requestAccount}>Request Account</button>
          <h3>Wallet Address: {walletAddress}</h3>
        </header>
      </div>
      <h1>To-Do List App</h1>
      <AddTaskForm addTask={addTask} />
      <TaskList tasks={tasks} markComplete={markComplete} />
    </div>
  );
}

export default App;
