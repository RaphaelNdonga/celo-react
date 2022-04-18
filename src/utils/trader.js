import MyNftAddress from "../contracts/MyNFT-address.json"

export const sendNft = async (traderContract, index, performActions) => {
    const { receiver, token, tokenId } = saleDetails;
    await performActions(async (kit) => {
        const { defaultAccount } = kit;
        try {
            let transaction = await traderContract.methods.sendNft(defaultAccount, MyNftAddress.Address, index).send({ from: defaultAccount });
            return transaction;
        } catch (error) {
            console.log("Error while sending nft: ", error);
        }
    })
}