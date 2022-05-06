import { useEffect, useState } from 'react';
import './App.css';
import contract from './contracts/MyNFT2.json';
import { ethers } from 'ethers';

const contractAddress = "0x4c052DEa01C6ec7b2e0A3502038bCc3Bbd57404e";
const abi = contract.abi;

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    console.log("Wallet1")
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log("Wallet2")

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log(signer);
	const address = await signer.getAddress();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        //let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.01") });
	const overrides: any = {
            gasLimit: 3000000
        };
        let nftTxn = await nftContract.mint(address, "https://live.staticflickr.com/65535/51034656657_4cbe0259ce_c.jpg", overrides);

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1>Scrappy Squirrels Tutorial</h1>
      <div>
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>
    </div>
  )
}

export default App;
