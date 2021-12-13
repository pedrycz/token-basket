// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./AbstractTokenBasket.sol";

contract TokenBasket is AbstractTokenBasket {

  uint256 private _basketSize;
  ITokenBasketHolding [] private _holdings;
  uint256 [] private _weights;

  constructor (string memory name_, string memory symbol_, ITokenBasketHolding [] memory holdings_, uint256 [] memory weights_) ERC20 (name_, symbol_) {
    require((_basketSize = holdings_.length) == weights_.length);
    _holdings = holdings_;
    _weights = weights_;
  }

  function basketSize() public override view returns (uint256) {
    return _basketSize;
  }

  function holdings(uint256 index) public override view returns (ITokenBasketHolding) {
    return _holdings[index];
  }

  function weights(uint256 index) public override view returns (uint256) {
    return _weights[index];
  }

}
