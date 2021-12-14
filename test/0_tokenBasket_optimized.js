const OptimizedTokenBasket = artifacts.require("OptimizedTokenBasket");
const TokenMock = artifacts.require("TokenMock");

// should be invoked on a fresh development network with "a a a a a a a a a a a a" mnemonic

contract("TokenBasket optimized test", accounts => {

  let holdings;
  let tokenBasket;

  it("verify performance of an optimized basket", async () => {
    console.log("Optimized Token basket:");
    let tokenBasket = await OptimizedTokenBasket.new();
    let deploymentReceipt = await web3.eth.getTransactionReceipt(tokenBasket.transactionHash);
    console.log(" - deploy: " + deploymentReceipt.gasUsed);
    assert.isBelow(deploymentReceipt.gasUsed, 2_100_000, "Deployment cost is bigger than 2100000");
  });

});
