import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nFTInfo, setnFTInfo] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      if (!ethereum) {
        toast.warn("Make sure you have MetaMask installed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener();
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      setIsLoading(false);
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        const connectedContract = createEthereumContract();

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(tokenId);
          console.log(from, tokenId.toNumber());
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalNFTs = async () => {
    const connectedContract = createEthereumContract();
    try {
      if (ethereum) {
        const NFTCountInfo = await connectedContract.getTotalMintedNFTs();
        console.log(NFTCountInfo);
        console.log(NFTCountInfo[0].toNumber(), NFTCountInfo[1].toNumber());
        setnFTInfo([NFTCountInfo[0].toNumber(), NFTCountInfo[1].toNumber()]);
        console.log(nFTInfo);
      }
    } catch (error) {}
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) {
        toast.warn("Make sure you have MetaMask Installed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);

        setCurrentAccount(accounts[0]);
        await getTotalNFTs();

        toast.success("🦄 Wallet is Connected", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log("Successfully connected");
        // setupEventListener();
      } else {
        console.log("No accounts found");
        toast.warn("Make sure your account is connected", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    try {
      setIsLoading(true);
      const { ethereum } = window;

      if (ethereum) {
        const connectedContract = createEthereumContract();

        let chainId = await ethereum.request({ method: "eth_chainId" });
        console.log("Connected to chain " + chainId);

        // String, hex code of the chainId of the Rinkebey test network
        const rinkebyChainId = "0x4";
        if (chainId === rinkebyChainId) {
          console.log("Going to pop wallet now to pay gas...");
          let nftTxn = await connectedContract.makeAnEpicNFT();

          console.log("Mining...please wait.");
          toast.info("Minting the NFT...", {
            position: "top-left",
            autoClose: 18050,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          await nftTxn.wait();

          console.log(
            `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
          );
          await getTotalNFTs();
          setIsLoading(false);
          toast.success("NFT Minted!", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setStatus("success");
          //          setMessage("");
        } else {
          toast.error("You are not connected to the Rinkeby Test Network!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // setMessage("You are not connected to the Rinkeby Test Network!");
          setStatus("error");
          return;
        }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setStatus("error");
      toast.error(`${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(error);
    }
  };
  useEffect(() => {
    checkIfWalletIsConnect();

    const { ethereum } = window;
    let connectedContract;
    const onNewMint = (from, tokenId) => {
      console.log(tokenId);
      console.log(from, tokenId.toNumber());
      setMessage(
        `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`
      );
    };

    if (ethereum) {
      connectedContract = createEthereumContract();

      // THIS IS THE MAGIC SAUCE.
      // This will essentially "capture" our event when our contract throws it.
      // If you're familiar with webhooks, it's very similar to that!

      connectedContract.on("NewEpicNFTMinted", onNewMint);

      console.log("Setup event listener!");
    } else {
      console.log("Ethereum object doesn't exist!");
    }
    // } catch (error) {
    //   console.log(error);
    // }

    return () => {
      if (connectedContract) {
        connectedContract.off("NewEpicNFTMinted", onNewMint);
      }
    };
  }, []);

  // useEffect(() => {

  //   // try {
  //   const { ethereum } = window;
  //   let connectedContract;
  //   const onNewMint = (from, tokenId) => {
  //     console.log(tokenId);
  //     console.log(from, tokenId.toNumber());
  //     alert(
  //       `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`
  //     );
  //   };

  //   if (ethereum) {
  //     connectedContract = createEthereumContract();

  //     // THIS IS THE MAGIC SAUCE.
  //     // This will essentially "capture" our event when our contract throws it.
  //     // If you're familiar with webhooks, it's very similar to that!

  //     connectedContract.on("NewEpicNFTMinted", onNewMint);

  //     console.log("Setup event listener!");
  //   } else {
  //     console.log("Ethereum object doesn't exist!");
  //   }
  //   // } catch (error) {
  //   //   console.log(error);
  //   // }

  //   return () => {
  //     if (connectedContract) {
  //       connectedContract.off("NewEpicNFTMinted", onNewMint);
  //     }
  //   };
  // }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        isLoading,
        nFTInfo,
        status,
        message,
        askContractToMintNft,
        setupEventListener,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
