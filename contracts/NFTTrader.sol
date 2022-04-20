// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/*
ERC721Holder enables smart contracts to be able to possess nfts.
*/
contract NFTTrader is ERC721Holder {
    mapping(uint256 => address) tokenIdAddressMap;
    address private cUsdTokenAddress;

    constructor(address _cUsdTokenAddress) {
        cUsdTokenAddress = _cUsdTokenAddress;
    }

    /*
    When someone wants to purchase an NFT, this function runs to 'sell' it to them.
    */
    function sellNFT(
        address _receiver,
        address _token,
        uint256 _tokenId,
        uint256 _price
    ) public {
        //get the address that was stored by the front end when the seller wanted to 'sell'
        address seller = getTokenOwner(_tokenId);

        //Transfer cUsd tokens to the original seller of the nft.
        IERC20(cUsdTokenAddress).transfer(seller, _price);

        //Remove the 'seller' data because they have been compensated.
        removeUserData(_tokenId);
        //Transfer the nft to the interested buyer
        IERC721(_token).safeTransferFrom(address(this), _receiver, _tokenId);
    }

    /**
    This function runs when the seller wants to sell the nft. It stores their address
    together with the token id of the token they wish to sell
     */

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
