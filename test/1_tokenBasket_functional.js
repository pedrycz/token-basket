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
    assert.rejects(tokenBasket.mint(6));
  });

  it("should not burn more tokens than owned", async () => {
    await tokenBasket.mint(5);
    assert.rejects(tokenBasket.burn(6));
  });

  it("should mint, transfer and burn tokens", async () => {
    await tokenBasket.mint(5);
    let balanceOfAccount0 = await tokenBasket.balanceOf(accounts[0]);
    assert.equal(balanceOfAccount0, 5, "Balance of account 0 is incorrect");
    let balancesOfAccount0 = await Promise.all(holdings.map(token => token.balanceOf(accounts[0])));
    assert.deepEqual(balancesOfAccount0.map(balance => balance.toNumber()), [10, 5], "Balances of account 0 are incorrect");
    await tokenBasket.transfer(accounts[1], 4);
    let balanceOfAccount1 = await tokenBasket.balanceOf(accounts[1]);
    assert.equal(balanceOfAccount1, 4, "Balance of account 1 is incorrect");
    await tokenBasket.burn(3, {from: accounts[1]});
    balanceOfAccount1 = await tokenBasket.balanceOf(accounts[1]);
    assert.equal(balanceOfAccount1, 1, "Balance of account 1 is incorrect");
    let balancesOfAccount1 = await Promise.all(holdings.map(token => token.balanceOf(accounts[1])));
    assert.deepEqual(balancesOfAccount1.map(balance => balance.toNumber()), [6, 9], "Balances of account 1 are incorrect");
  });
});
