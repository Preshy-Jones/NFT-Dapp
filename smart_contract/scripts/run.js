const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  let mintedNFTsCount;
  // Call the function.
  let txn = await nftContract.makeAnEpicNFT();
  // Wait for it to be mined.
  await txn.wait();

  mintedNFTsCount = await nftContract.getTotalMintedNFTs();
  console.log(mintedNFTsCount);
  console.log(mintedNFTsCount[0].toNumber(), mintedNFTsCount[1].toNumber());

  // Mint another NFT for fun.
  txn = await nftContract.makeAnEpicNFT();
  // Wait for it to be mined.
  await txn.wait();
  mintedNFTsCount = await nftContract.getTotalMintedNFTs();
  console.log(mintedNFTsCount);
  console.log(mintedNFTsCount[0].toNumber(), mintedNFTsCount[1].toNumber());

  // Mint another NFT for fun.
  txn = await nftContract.makeAnEpicNFT();
  // Wait for it to be mined.
  await txn.wait();
  mintedNFTsCount = await nftContract.getTotalMintedNFTs();
  console.log(mintedNFTsCount);
  console.log(mintedNFTsCount[0].toNumber(), mintedNFTsCount[1].toNumber());
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
