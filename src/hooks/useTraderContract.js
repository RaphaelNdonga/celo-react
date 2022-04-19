import { useContract } from "./useContract";
import NFTTrader from "../contracts/NFTTrader.json";
import NFTTraderAddress from "../contracts/NFTTrader-address.json";

//fetching the nft trader contract using the use contract hook
export const useTraderContract = () => useContract(NFTTrader.abi, NFTTraderAddress.Address);