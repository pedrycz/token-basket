const TokenBasketFactory = artifacts.require("TokenBasketFactory");
const TokenBasket = artifacts.require("TokenBasket");
const TokenMock = artifacts.require("TokenMock");

contract("TokenBasket factory test", accounts => {
  let tokenBasket;

  it("log TokenBasketFactory gas usage and check consistency", async () => {
    console.log("Token basket factory gas usage:");
    let tokenBasketFactory = await TokenBasketFactory.new();
    let deploymentReceipt = await web3.eth.getTransactionReceipt(tokenBasketFactory.transactionHash);
    console.log(" - factory deployment: " + deploymentReceipt.gasUsed);
    let holdings = await Promise.all([TokenMock.new("Token Mock 1", "TM1"), TokenMock.new("Token Mock 2", "TM2")]);
    let tokenBasketTx = await tokenBasketFactory.createTokenBasket.sendTransaction("Example Token Basket", "ETB", 10, holdings.map(token => token.address), [2, 3]);
    console.log(" - contract creation: " + tokenBasketTx.receipt.gasUsed);
    let tokenBasket = await TokenBasket.at(tokenBasketTx.logs[0].args.tokenBasketAddress);
    let name = await tokenBasket.name();
    assert.equal(name, "Example Token Basket", "Balance of tokenBasket is incorrect");
    let symbol = await tokenBasket.symbol();
    assert.equal(symbol, "ETB", "Size of tokenBasket is incorrect");
    let decimals = await tokenBasket.decimals();
    assert.equal(decimals, 10, "Balance of tokenBasket is incorrect");
    let basketSize = await tokenBasket.basketSize();
    assert.equal(basketSize, 2, "Size of tokenBasket is incorrect");
    let holding0 = await tokenBasket.holdings(0);
    assert.equal(holding0, holdings[0].address, "1st tokenBasket holding is incorrect");
    let holding1 = await tokenBasket.holdings(1);
    assert.equal(holding1, holdings[1].address, "2nd tokenBasket holding is incorrect");
    let weight0 = await tokenBasket.weights(0);
    assert.equal(weight0, 2, "1st tokenBasket weight is incorrect");
    let weight1 = await tokenBasket.weights(1);
    assert.equal(weight1, 3, "2nd tokenBasket weight is incorrect");
    let owner = await tokenBasket.owner();
    assert.equal(owner, accounts[0], "Owner of tokenBasket is incorrect");
  });
});
