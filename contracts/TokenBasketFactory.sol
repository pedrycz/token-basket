// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./TokenBasket.sol";

contract TokenBasketFactory is Context {
  event TokenBasketCreated(address tokenBasketAddress);

  function createTokenBasket(string memory name_, string memory symbol_, uint8 decimals_, IERC20 [] memory holdings_, uint256 [] memory weights_) public {
    TokenBasket tokenBasket = new TokenBasket(name_, symbol_, decimals_, holdings_, weights_);
    tokenBasket.transferOwnership(_msgSender());
    emit TokenBasketCreated(address(tokenBasket));
  }
}
