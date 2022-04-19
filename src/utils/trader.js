import traderAddress from "../contracts/NFTTrader-address.json"
import myNftAddress from "../contracts/MyNFT-address.json"
import { useMinterContract } from "../hooks";

//sending nft from trader contract
export const sellNft = async (traderContract, index, performActions) => {
    await performActions(async (kit) => {
        const { defaultAccount } = kit;
        try {
            let transaction = await traderContract.methods.sendNFT(defaultAccount, myNftAddress.Address, index).send({ from: defaultAccount });
            console.log("Trying to sell nft txn: ", transaction);
            return transaction;
        } catch (error) {
            console.log("Error while selling nft: ", error);
        }
    })
}

//sending nft to trader contract

export const acquireNft = async (minterContract, index, performActions) => {
    await performActions(async (kit) => {
        const { defaultAccount } = kit;
        try {
            let txn = await minterContract.methods.transferFrom(defaultAccount, traderAddress.Address, index).send({ from: defaultAccount });
            console.log("Trying to acquire nft, txn: ", txn);
            return txn;
        } catch (error) {
            console.log("Error buying nft: ", error);
        }
    })
}