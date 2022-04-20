const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Trader", function () {
    this.timeout(50000);

    let nftTraderContract;
    let myNFTContract;
    let owner;
    let acc1;
    let acc2;
    this.beforeEach(async function () {
        let nftTraderFactory = await ethers.getContractFactory("NFTTrader");
        let myNFTFactory = await ethers.getContractFactory("MyNFT");
        [owner, acc1, acc2] = await ethers.getSigners();

        nftTraderContract = await nftTraderFactory.deploy();
        myNFTContract = await myNFTFactory.deploy();

        await nftTraderContract.deployed();
        await myNFTContract.deployed();

        await myNFTContract.safeMint(owner.address, "example.com")
    });

    it("Should receive an nft properly", async function () {
        let txn = await myNFTContract.transferFrom(owner.address, nftTraderContract.address, 0);
        await txn.wait();
        expect(await myNFTContract.ownerOf(0)).to.equal(nftTraderContract.address);
    });

    it("Should send nft properly", async function () {
        let txn = await myNFTContract.transferFrom(owner.address, nftTraderContract.address, 0);
        await txn.wait();
        txn = await nftTraderContract.sendNFT(owner.address, myNFTContract.address, 0);
        await txn.wait();
        expect(await myNFTContract.ownerOf(0)).to.equal(owner.address);
    });

    it("Should store user data", async function () {
        let txn = await nftTraderContract.storeUserData(owner.address, 0);
        await txn.wait();
        expect(await nftTraderContract.getTokenOwner(0)).to.equal(owner.address);
    })
})