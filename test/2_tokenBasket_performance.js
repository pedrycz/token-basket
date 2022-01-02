const TokenBasket = artifacts.require("TokenBasket");
const TokenMock = artifacts.require("TokenMock");

contract("TokenBasket performance test", accounts => {
  async function reportGenerator(nHoldings, maxDeploymentCost) {
    console.log("Token basket of " + nHoldings + " holdings:");
    let holdings = await Promise.all(Array.from(Array(nHoldings).keys()).map(key => TokenMock.new(key, key)));
    let tokenBasket = await TokenBasket.new("Example Token Basket", "ETB", holdings.map(token => token.address), new Array(holdings.length).fill(2));
    let deploymentReceipt = await web3.eth.getTransactionReceipt(tokenBasket.transactionHash);
    console.log(" - deploy: " + deploymentReceipt.gasUsed);
    assert.isBelow(deploymentReceipt.gasUsed, maxDeploymentCost, "Deployment cost is bigger than " + maxDeploymentCost);
    await Promise.all(holdings.map(token => token.mint(50)));
    await Promise.all(holdings.map(token => token.approve(tokenBasket.address, 50)));
    let mintResult = await tokenBasket.mint(10);
    console.log(" - mint: " + mintResult.receipt.gasUsed);
    let approve1Result = await tokenBasket.approve(accounts[1], 10);
    console.log(" - 1st approve: " + approve1Result.receipt.gasUsed);
    let approve2Result = await tokenBasket.approve(accounts[1], 10);
    console.log(" - 2nd approve: " + approve2Result.receipt.gasUsed);
    let transferFrom1Result = await tokenBasket.transferFrom(accounts[0], accounts[1], 1, {from: accounts[1]});
    console.log(" - 1st transfer from: " + transferFrom1Result.receipt.gasUsed);
    let transferFrom2Result = await tokenBasket.transferFrom(accounts[0], accounts[1], 1, {from: accounts[1]});
    console.log(" - 2nd transfer from: " + transferFrom2Result.receipt.gasUsed);
    let transfer1Result = await tokenBasket.transfer(accounts[1], 1);
    console.log(" - 1st transfer: " + transfer1Result.receipt.gasUsed);
    let transfer2Result = await tokenBasket.transfer(accounts[1], 1);
    console.log(" - 2nd transfer: " + transfer2Result.receipt.gasUsed);
    let burn1Result = await tokenBasket.burn(1, {from: accounts[1]});
    console.log(" - 1st burn: " + burn1Result.receipt.gasUsed);
    let burn2Result = await tokenBasket.burn(1, {from: accounts[1]});
    console.log(" - 2nd burn: " + burn2Result.receipt.gasUsed);
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
