// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//ERC721Holder enables smart contracts to be able to possess nfts.
contract NFTTrader is ERC721Holder {
    mapping(uint256 => address) tokenIdAddressMap;
    address private cUsdTokenAddress;

    constructor(address _cUsdTokenAddress) {
        cUsdTokenAddress = _cUsdTokenAddress;
    }

    function sellNFT(
        address _receiver,
        address _token,
        uint256 _tokenId,
        uint256 _price
    ) public {
        address seller = getTokenOwner(_tokenId);
        IERC20(cUsdTokenAddress).transfer(seller, _price);
        removeUserData(_tokenId);
        IERC721(_token).safeTransferFrom(address(this), _receiver, _tokenId);
    }

    function storeUserData(address _user, uint256 _tokenId) public {
        tokenIdAddressMap[_tokenId] = _user;
    }

    function removeUserData(uint256 _tokenId) public {
        tokenIdAddressMap[_tokenId] = address(0);
    }

    function getTokenOwner(uint256 _tokenId) public view returns (address) {
        return tokenIdAddressMap[_tokenId];
    }
}
