// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./BEP20.sol";

abstract contract AbstractTokenBasket is BEP20 {
  function basketSize() public virtual view returns (uint256);

  function holdings(uint256 index) public virtual view returns (IERC20);

  function weights(uint256 index) public virtual view returns (uint256);

  function mint(address account, uint256 amount) public {
    for (uint256 i = 0; i < basketSize(); i++) {
      holdings(i).transferFrom(_msgSender(), address(this), amount * weights(i));
    }
    _mint(account, amount);
  }

  function burn(address account, uint256 amount) public {
    for (uint256 i = 0; i < basketSize(); i++) {
      holdings(i).transfer(account, amount * weights(i));
    }
    _burn(_msgSender(), amount);
  }
}
