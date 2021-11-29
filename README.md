# TokenBasket

[![NPM Package](https://img.shields.io/npm/v/token-basket.svg)](https://www.npmjs.org/package/token-basket)
[![License](https://img.shields.io/badge/License-MIT-blue)](https://opensource.org/licenses/MIT)

ERC20 token representing a fixed set of other ERC20 tokens with predefined weights.

## Overview

TokenBasket is for the crypto market what ETF is for the stock market. It works like a wrapper for token collections, making them much more convienient and cost-effective to transfer.

## Example usage

```solidity
import "token-basket/contracts/TokenBasket.sol";

contract ExampleTokenBasket is TokenBasket {

  constructor () TokenBasket ("Example Token Basket", "ETB", [
      0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2, // WETH
      0xB8c77482e45F1F44dE1745F52C74426C631bDD52, // BNB
    ], [ 2, 3 ]) {
  }

}
```

Each unit of ETB (Example Token Basket) is pegged to 2 units of WETH and 3 units of BNB (you need to deposit 2 WETH + 3 BNB in order to mint 1 ETB, analogically you will be rewarded 2 WETH + 3 BNB for burning 1 ETB).

## Gas usage estimation (Ethereum chain)

| operation | gas usage |
| --- | --- |
| deploy | ~ 1955 k + 42 k for every underlying token |
| mint (without approvals) | ~ 67 k + 45 k for every underlying token |
| transfer, approve | just like for the single token |
| burn | ~ 37 k + 36 k for every underlying token |

## Projects using TokenBasket

TBD

## License

TokenBasket is released under the MIT License.
