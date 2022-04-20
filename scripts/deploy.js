// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const myNFTFactory = await hre.ethers.getContractFactory("MyNFT");
  const myNFT = await myNFTFactory.deploy();

  await myNFT.deployed();

  console.log("My NFT Contract deployed to:", myNFT.address);

  const nftTraderFactory = await hre.ethers.getContractFactory("NFTTrader");
  const cUsdTokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
  const nftTrader = await nftTraderFactory.deploy(cUsdTokenAddress);

  console.log("NFT Trader Contract deployed to:", nftTrader.address);
  await nftTrader.deployed();
  storeContractData(myNFT, "MyNFT")
  storeContractData(nftTrader, "NFTTrader")
}

//Changed storeContractData to be more flexible when creating multiple contracts
function storeContractData(contract, contractName) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${contractName}-address.json`,
    JSON.stringify({ Address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(contractName);

  fs.writeFileSync(
    contractsDir + `/${contractName}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

