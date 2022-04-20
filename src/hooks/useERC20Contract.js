import { useContract } from "./useContract";
import ERC20Abi from "../contracts/ERC20.json";
import ERC20Address from "../contracts/ERC20-address.json";

export const useERC20Contract = () => useContract(ERC20Abi, ERC20Address.Address);