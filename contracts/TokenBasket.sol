// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./AbstractTokenBasket.sol";

contract TokenBasket is AbstractTokenBasket {
  uint8 private immutable _decimals;
  uint256 private immutable _basketSize;
  IERC20 [] private _holdings;
  uint256 [] private _weights;

  constructor (string memory name_, string memory symbol_, uint8 decimals_, IERC20 [] memory holdings_, uint256 [] memory weights_) BEP20 (name_, symbol_) {
    _decimals = decimals_;
    require((_basketSize = holdings_.length) == weights_.length);
    _holdings = holdings_;
    _weights = weights_;
  }

  function decimals() public override view returns (uint8) {
    return _decimals;
  }

  function basketSize() public override view returns (uint256) {
    return _basketSize;
  }

  function holdings(uint256 index) public override view returns (IERC20) {
    return _holdings[index];
  }

  function weights(uint256 index) public override view returns (uint256) {
    return _weights[index];
  }
}
