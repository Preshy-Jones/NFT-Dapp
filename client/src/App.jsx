import "./App.css";
import React, { useContext, useEffect } from "react";
import { TransactionContext } from "./context/TransactionContext";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const App = () => {
  // Render Methods

  const {
    currentAccount,
    connectWallet,
    askContractToMintNft,
    isLoading,
    nFTInfo,
    status,
    message,
    setupEventListener,
  } = useContext(TransactionContext);
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    console.log(nFTInfo);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          <h1 className="text-white">Total NFTs minted</h1>
          {/* <pre className="text-white">{JSON.stringify(nFTInfo, null, 2)}</pre> */}
          {nFTInfo.length && (
            <h1 className="text-white">{`${nFTInfo[0]}/${nFTInfo[1]}`}</h1>
          )}

          {status && (
            <motion.p
              initial={{ x: "100vw" }}
              animate={{ x: 0 }}
              transition={{ duration: 1 }}
              className={`${
                status === "success" ? "text-lime-500" : "text-red-500"
              } text-[1em] font-elite`}
            >
              {status === "success" ? message : ""}
            </motion.p>
          )}

          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button
              onClick={askContractToMintNft}
              className="cta-button connect-wallet-button text-red-500"
            >
              {isLoading ? "Loading..." : "Mint NFT"}
            </button>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
