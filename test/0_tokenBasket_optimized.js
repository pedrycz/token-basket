const OptimizedTokenBasket = artifacts.require("OptimizedTokenBasket");
const TokenMock = artifacts.require("TokenMock");

// should be invoked on a fresh development network with "a a a a a a a a a a a a" mnemonic

contract("TokenBasket optimized test", accounts => {
  it("verify performance of an optimized basket", async () => {
    console.log("Optimized Token basket:");
    let gasUsed = (await web3.eth.getTransactionReceipt((await OptimizedTokenBasket.new()).transactionHash)).gasUsed;
    console.log(" - deploy: " + gasUsed);
    assert.isBelow(gasUsed, 1_150_000, "Deployment cost is bigger than 1150000");
  });
});
