# TokenBasket

[![NPM Package](https://img.shields.io/npm/v/token-basket.svg)](https://www.npmjs.org/package/token-basket)
[![License](https://img.shields.io/github/license/pedrycz/token-basket)](https://github.com/pedrycz/token-basket/blob/master/LICENSE)

ERC20 (BEP20) token representing a fixed set of other tokens with predefined weights

## Overview

TokenBasket is for the crypto market what ETF is for the stock market. It works like a wrapper for token collections, making them much more convenient and cost-effective to transfer.

Let's imagine a following TokenBasket:

```
name: Example Token Basket
symbol: ETB
holdings:
  - Wrapped Ether (WETH), weight: 2
  - Binance Coin (BNB), weight: 3
```



Each unit of ETB (Example Token Basket) is pegged to 2 units of WETH and 3 units of BNB (you need to deposit 2 WETH + 3 BNB in order to mint 1 ETB, analogically you will be rewarded 2 WETH + 3 BNB for burning 1 ETB).

## Lifecycle and gas usage estimation

### Deployment
 
TokenBasket constructor takes 4 parameters:
 1. token basket name
 2. token basket symbol
 3. array of holdings (addresses of underlying token contracts)
 4. array of holding weights in the basket

That's how Example Token Basket could be deployed:

```solidity
pragma solidity ^0.8.0;

import "token-basket/contracts/TokenBasket.sol";

contract ExampleTokenBasket is TokenBasket {
  constructor () TokenBasket ("Example Token Basket", "ETB",
      [ 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2, // WETH address
      0xB8c77482e45F1F44dE1745F52C74426C631bDD52 ], // BNB address
      [ 2, 3 ]) {
  }
}
```

```solidity
EXAMPLE_TOKEN_BASKET_ADDRESS = new ExampleTokenBasket();
```

Gas usage for the deployment can be roughly estimated as **2,105,000 + 42,000 per holding** so in above case it would be around 2,189,000.

### Minting

Prerequisite for minting is an approval to transfer underlying holdings (amount to be minted multiplied by the holding weight) from the minter's address to the TokenBasket contract address.

Approvals necessary to mint 50 units (with 18 decimal places) of Example Token Basket would look like this from the minter perspective:

```
approve(EXAMPLE_TOKEN_BASKET_ADDRESS, 2 * 50 * 10**18); // for WETH address
approve(EXAMPLE_TOKEN_BASKET_ADDRESS, 3 * 50 * 10**18); // for BNB address
```

Approval gas usage depends only on underlying holdings. Usually it's **up to 45,000 per holding** so in above case it would be around 90,000.

Actual mint function takes only one argument: amount of units to be minted. For 50 units with 18 decimal places it would be:

```
mint(50 * 10**18); // for EXAMPLE_TOKEN_BASKET_ADDRESS
```

Under the hood, this function transfers approved holdings to the TokenBasket contract address and increases minter's balance accordingly. Gas usage: usually **up to 66,000 + up to 45,000 per holding**, so around 156,000 for the above case.

### Transfer

Transfers and operations connected to allowance are intended to be the most optimized. They shouldn't use more gas than analogical operations for other ERC20 (BEP20) tokens, usually **between 25,000 and 65,000**.
 
### Burning
 
Burning process is analogical to minting process, burn function takes only one argument: amount of units to be burned. For 50 units with 18 decimal places it would be:
                                                                                                                  
```
burn(50 * 10**18); // for EXAMPLE_TOKEN_BASKET_ADDRESS
```

It decreases burner's balance and transfers underlying tokens to his address. Gas usage: around **37,000 + between 21,000 and 36,000 per holding**, so up to 109,000 for Example Token Basket.

## Gas usage optimization

Gas usage can be slightly optimized by storing holdings and weights in a constant array.
In order to achieve that, instead of calling TokenBasket constructor, new contract (extending AbstractTokenBasket) needs to be created. 

 * deployment gas usage can be reduced to **2,010,000** + **17,000** per every holding
 * minting and burning gas usage can be optimized by few % as well, depending on the underlying tokens

## Projects using TokenBasket

TBD

## License

TokenBasket is released under the [MIT License](https://github.com/pedrycz/token-basket/blob/master/LICENSE).
