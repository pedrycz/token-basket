const TokenBasket = artifacts.require("TokenBasket");
const TokenMock = artifacts.require("TokenMock");

contract("TokenBasket test", accounts => {

  let holdings;
  let tokenBasket;

  beforeEach(() => {
    return Promise.all([
      TokenMock.new("Token Mock 1", "TM1"),
      TokenMock.new("Token Mock 2", "TM2")
    ]).then(generatedTokenMocks => {
      holdings = generatedTokenMocks;
      return TokenBasket.new("Example Token Basket", "ETB", holdings.map(token => token.address), [2, 3]);
    }).then(generatedTokenBasket => {
      tokenBasket = generatedTokenBasket;
      return Promise.all(holdings.map(token => token.mint(20)));
    }).then(() => {
      return Promise.all(holdings.map(token => token.approve(tokenBasket.address, 15)));
    });
  });

  it("should not mint more tokens than allowed", async () => {
    return tokenBasket.mint(6).then(() => {
      throw "Minted more tokens than allowed";
    }).catch(err => {
      // OK
    });
  });

  it("should not burn more tokens than owned", async () => {
    return tokenBasket.mint(5).then(() => {
      return tokenBasket.burn(6);
    }).then(() => {
      throw "Burned more tokens than owned";
    }).catch(err => {
      // OK
    });
  });

  it("should mint, transfer and burn tokens", async () => {
    return tokenBasket.mint(5).then(() => {
      return tokenBasket.balanceOf(accounts[0]);
    }).then(balanceOfAccount0 => {
      assert.equal(balanceOfAccount0, 5, "Balance of account 0 is incorrect");
      return Promise.all(holdings.map(token => token.balanceOf(accounts[0])));
    }).then(balancesOfAccount0 => {
      assert.deepEqual(balancesOfAccount0.map(balance => balance.toNumber()), [10, 5], "Balances of account 0 are incorrect");
      return tokenBasket.transfer(accounts[1], 4);
    }).then(() => {
      return tokenBasket.balanceOf(accounts[1]);
    }).then(balanceOfAccount1 => {
      assert.equal(balanceOfAccount1, 4, "Balance of account 1 is incorrect");
      return tokenBasket.burn(3, {from: accounts[1]});
    }).then(() => {
      return tokenBasket.balanceOf(accounts[1]);
    }).then(balanceOfAccount1 => {
      assert.equal(balanceOfAccount1, 1, "Balance of account 1 is incorrect");
      return Promise.all(holdings.map(token => token.balanceOf(accounts[1])));
    }).then(balancesOfAccount1 => {
      assert.deepEqual(balancesOfAccount1.map(balance => balance.toNumber()), [6, 9], "Balances of account 1 are incorrect");
    });
  });

});
