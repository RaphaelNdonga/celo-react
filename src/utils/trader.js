import traderAddress from "../contracts/NFTTrader-address.json"
import myNftAddress from "../contracts/MyNFT-address.json"
import { useMinterContract } from "../hooks";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";

//sending nft from trader contract
export const sellNft = async (traderContract, erc20Contract, index, performActions) => {
    await performActions(async (kit) => {
        const { defaultAccount } = kit;
        try {
            const bigNumberPrice = ethers.utils.parseUnits("1", 'ether')
            console.log({ bigNumberPrice })
            let txn = await erc20Contract.methods.transfer(traderAddress.Address, bigNumberPrice).send({ from: defaultAccount });
            let transaction = await traderContract.methods.sellNFT(defaultAccount, myNftAddress.Address, index, bigNumberPrice).send({ from: defaultAccount });
            console.log("Trying to sell nft txn: ", transaction);
            return transaction;
        } catch (error) {
            console.log("Error while selling nft: ", error);
        }
    })
}

//sending nft to trader contract

export const acquireNft = async (minterContract, traderContract, index, performActions) => {
    await performActions(async (kit) => {
        const { defaultAccount } = kit;
        try {
            let txn = await traderContract.methods.storeUserData(defaultAccount, index).send({ from: defaultAccount });
            txn = await minterContract.methods.transferFrom(defaultAccount, traderAddress.Address, index).send({ from: defaultAccount });
            console.log("Trying to acquire nft, txn: ", txn);
            return txn;
        } catch (error) {
            console.log("Error buying nft: ", error);
        }
    })
}