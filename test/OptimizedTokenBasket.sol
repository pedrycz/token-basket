// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../contracts/AbstractTokenBasket.sol";

contract OptimizedTokenBasket is AbstractTokenBasket {

  constructor () ERC20 ("Optimized Token Basket", "OTB") {
  }

  function basketSize() public override pure returns (uint256) {
    return 5;
  }

  function holdings(uint256 index) public override pure returns (ITokenBasketHolding) {
    return ITokenBasketHolding([
      0x8E1891407f03b77863da0b1430CbFB24ad687620,
      0x906a6D320f040F113d145d9a5bA086236EeDc1b2,
      0xbB209218b8562C9b66c076f772Cb4e8ec8167eD9,
      0xfdd7FCee70522EB08C1f6444B467bD5A54A004b4,
      0x26F53841b56E09b119db0316F73A6D89Bb4799Fc
    ][index]);
  }

  function weights(uint256 index) public override pure returns (uint256) {
    return [1, 2, 3, 4, 5][index];
  }

}
