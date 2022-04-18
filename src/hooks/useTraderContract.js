import { useContract } from "./useContract";
import NFTTrader from "../contracts/NFTTrader.json";
import NFTTraderAddress from "../contracts/NFTTrader-address.json";

export const useTraderContract = () => useContract(NFTTrader.abi, NFTTraderAddress.Address);