// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

//ERC721Holder enables smart contracts to be able to possess nfts.
contract NFTTrader is ERC721Holder {
    constructor() {}

    function sendNFT(
        address _receiver,
        address _token,
        uint256 _tokenId
    ) public {
        IERC721(_token).safeTransferFrom(address(this), _receiver, _tokenId);
    }
}
