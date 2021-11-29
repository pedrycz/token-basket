// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenBasket is ERC20 {

  // IERC20 can be replaced with something less restrictive, only transfer(...) and transferFrom(...) methods are needed
  IERC20 [] private _holdings;
  uint256 [] private _weights;

  constructor (string memory name_, string memory symbol_,IERC20 [] memory holdings_, uint256 [] memory weights_) ERC20 (name_, symbol_) {
    require(holdings_.length == weights_.length);
    _holdings = holdings_;
    _weights = weights_;
  }

  function holdings() public view returns (IERC20 [] memory) {
    return _holdings;
  }

  function weights() public view returns (uint256 [] memory) {
    return _weights;
  }

  function mint(uint256 amount) public {
    for (uint256 i = 0; i < _holdings.length; i++) {
      _holdings[i].transferFrom(_msgSender(), address(this), amount * _weights[i]);
    }
    _mint(_msgSender(), amount);
  }

  function burn(uint256 amount) public {
    for (uint256 i = 0; i < _holdings.length; i++) {
      _holdings[i].transfer(_msgSender(), amount * _weights[i]);
    }
    _burn(_msgSender(), amount);
  }

}