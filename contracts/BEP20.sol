// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BEP20 is ERC20, Ownable {
  function getOwner() public virtual view returns (address) {
    return owner();
  }

  constructor (string memory name, string memory symbol) ERC20 (name, symbol) {
  }
}
