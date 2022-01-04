const TokenBasket = artifacts.require("TokenBasket");
const TokenMock = artifacts.require("TokenMock");

contract("TokenBasket performance test", accounts => {
  async function reportGenerator(nHoldings, maxDeploymentCost) {
    console.log("Token basket of " + nHoldings + " holdings:");
    let holdings = await Promise.all(Array.from(Array(nHoldings).keys()).map(key => TokenMock.new(key, key)));
    let tokenBasket = await TokenBasket.new("Example Token Basket", "ETB", 10, holdings.map(h => h.address), new Array(holdings.length).fill(2));
    let gasUsed = (await web3.eth.getTransactionReceipt(tokenBasket.transactionHash)).gasUsed;
    console.log(" - deploy: " + gasUsed);
    assert.isBelow(gasUsed, maxDeploymentCost, "Deployment cost is bigger than " + maxDeploymentCost);

    await Promise.all(holdings.map(h => h.mint(50)));
    await Promise.all(holdings.map(h => h.approve(tokenBasket.address, 50)));
    console.log(" - mint: " + (await tokenBasket.mint(accounts[0], 10)).receipt.gasUsed);
    console.log(" - 1st approve: " + (await tokenBasket.approve(accounts[1], 10)).receipt.gasUsed);
    console.log(" - 2nd approve: " + (await tokenBasket.approve(accounts[1], 10)).receipt.gasUsed);
    console.log(" - 1st transfer from: " + (await tokenBasket.transferFrom(accounts[0], accounts[1], 1, {from: accounts[1]})).receipt.gasUsed);
    console.log(" - 2nd transfer from: " + (await tokenBasket.transferFrom(accounts[0], accounts[1], 1, {from: accounts[1]})).receipt.gasUsed);
    console.log(" - 1st transfer: " + (await tokenBasket.transfer(accounts[1], 1)).receipt.gasUsed);
    console.log(" - 2nd transfer: " + (await tokenBasket.transfer(accounts[1], 1)).receipt.gasUsed);
    console.log(" - 1st burn: " + (await tokenBasket.burn(accounts[1], 1, {from: accounts[1]})).receipt.gasUsed);
    console.log(" - 2nd burn: " + (await tokenBasket.burn(accounts[1], 1, {from: accounts[1]})).receipt.gasUsed);
  }

  it("verify performance of an empty basket", async () => {
    return reportGenerator(0, 1_160_000);
  });

  it("verify performance of a single-holding basket", async () => {
    return reportGenerator(1, 1_240_000);
  });

  it("verify performance of a basket consisting of 5 holdings", async () => {
    return reportGenerator(5, 1_410_000);
  });
});
