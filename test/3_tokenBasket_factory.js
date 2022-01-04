const TokenBasketFactory = artifacts.require("TokenBasketFactory");
const TokenBasket = artifacts.require("TokenBasket");
const TokenMock = artifacts.require("TokenMock");

contract("TokenBasket factory test", accounts => {
  let tokenBasket;

  it("log TokenBasketFactory gas usage and consistency test", async () => {
    console.log("Token basket factory gas usage:");
    let tokenBasketFactory = await TokenBasketFactory.new();
    console.log(" - factory deployment: " + (await web3.eth.getTransactionReceipt(tokenBasketFactory.transactionHash)).gasUsed);

    let holdings = await Promise.all([TokenMock.new("Token Mock 1", "TM1"), TokenMock.new("Token Mock 2", "TM2")]);

    let tokenBasketTx = await tokenBasketFactory.createTokenBasket.sendTransaction("Example Token Basket", "ETB", 10, holdings.map(token => token.address), [2, 3]);
    console.log(" - contract creation: " + tokenBasketTx.receipt.gasUsed);
    let tokenBasket = await TokenBasket.at(tokenBasketTx.logs[0].args.tokenBasketAddress);
    assert.equal((await tokenBasket.name()), "Example Token Basket", "Balance of tokenBasket is incorrect");
    assert.equal((await tokenBasket.symbol()), "ETB", "Size of tokenBasket is incorrect");
    assert.equal((await tokenBasket.decimals()), 10, "Balance of tokenBasket is incorrect");
    assert.equal((await tokenBasket.basketSize()), 2, "Size of tokenBasket is incorrect");
    assert.equal((await tokenBasket.holdings(0)), holdings[0].address, "1st tokenBasket holding is incorrect");
    assert.equal((await tokenBasket.holdings(1)), holdings[1].address, "2nd tokenBasket holding is incorrect");
    assert.equal((await tokenBasket.weights(0)), 2, "1st tokenBasket weight is incorrect");
    assert.equal((await tokenBasket.weights(1)), 3, "2nd tokenBasket weight is incorrect");
    assert.equal((await tokenBasket.owner()), accounts[0], "Owner of tokenBasket is incorrect");
  });
});
