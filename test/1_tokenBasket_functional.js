const assert = require('assert');

const TokenBasket = artifacts.require("TokenBasket");
const TokenMock = artifacts.require("TokenMock");

contract("TokenBasket functional test", accounts => {
  let holdings;
  let tokenBasket;

  beforeEach(async () => {
    holdings = await Promise.all([TokenMock.new("Token Mock 1", "TM1"), TokenMock.new("Token Mock 2", "TM2")]);
    tokenBasket = await TokenBasket.new("Example Token Basket", "ETB", 10, holdings.map(token => token.address), [2, 3]);
    await Promise.all(holdings.map(token => token.mint(20)));
    await Promise.all(holdings.map(token => token.approve(tokenBasket.address, 15)));
  });

  it("should not mint more tokens than allowed", async () => {
    assert.rejects(tokenBasket.mint(accounts[0], 6));
  });

  it("should not burn more tokens than owned", async () => {
    await tokenBasket.mint(accounts[0], 5);
    assert.rejects(tokenBasket.burn(accounts[0], 6));
  });

  it("should mint, transfer and burn tokens", async () => {
    await tokenBasket.mint(accounts[1], 5);
    assert.equal((await tokenBasket.decimals()), 10, "Decimals of tokenBasket is incorrect");
    assert.equal((await tokenBasket.basketSize()), 2, "Size of tokenBasket is incorrect");
    assert.equal((await tokenBasket.holdings(0)), holdings[0].address, "1st tokenBasket holding is incorrect");
    assert.equal((await tokenBasket.holdings(1)), holdings[1].address, "2nd tokenBasket holding is incorrect");
    assert.equal((await tokenBasket.weights(0)), 2, "1st tokenBasket weight is incorrect");
    assert.equal((await tokenBasket.weights(1)), 3, "2nd tokenBasket weight is incorrect");
    assert.equal((await tokenBasket.balanceOf(accounts[1])), 5, "Balance of account 1 is incorrect");
    assert.deepEqual((await Promise.all(holdings.map(h => h.balanceOf(accounts[0])))).map(b => b.toNumber()), [10, 5],
      "Balances of account 0 are incorrect");

    await tokenBasket.transfer(accounts[0], 4, {from: accounts[1]});
    assert.equal((await tokenBasket.balanceOf(accounts[0])), 4, "Balance of account 0 is incorrect");

    await tokenBasket.burn(accounts[1], 3);
    assert.equal((await tokenBasket.balanceOf(accounts[0])), 1, "Balance of account 0 is incorrect");
    assert.deepEqual((await Promise.all(holdings.map(h => h.balanceOf(accounts[1])))).map(b => b.toNumber()), [6, 9],
      "Balances of account 1 are incorrect");
  });
});
