const RoboPunksNFT = artifacts.require("./RoboPunksNFT.sol");

contract("RoboPunksNFT", (accounts) => {
  let tokenInstance;
  before(async () => {
    await RoboPunksNFT.deployed().then((instance) => {
      tokenInstance = instance;
    });
  });

  it("deploys successfully", async () => {
    const address = await tokenInstance.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("initializes the contract with the correct values", async () => {
    const name = await tokenInstance.name();
    const symbol = await tokenInstance.symbol();
    const mintPrice = await tokenInstance.mintPrice();
    const maxSupply = await tokenInstance.maxSupply();
    const maxPreWallet = await tokenInstance.maxPreWallet();
    assert.equal(name, "RoboPunks", "has the correct name");
    assert.equal(symbol, "RP", "has the correct symbol");
    assert.equal(mintPrice, 10000000000000000, "has the correct Price");
    assert.equal(maxSupply, 1000, "has the correct maxSupply");
    assert.equal(maxPreWallet, 10, "has the correct maxPreWallet");
  });
  it("set IsPublicMintEnabled from account other than the owner", async () => {
    await tokenInstance
      .setIsPublicMintEnabled(true, { from: accounts[1] })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf(
            "revert" >= 0,
            "must be owner to set IsPublicMintEnabled"
          )
        );
      });
  });
  it("set IsPublicMintEnabled as owner", async () => {
    const oldIsPublicMintEnabled = await tokenInstance.isPublicMintEnabled();
    await tokenInstance.setIsPublicMintEnabled(true, { from: accounts[0] });
    const newIsPublicMintEnabled = await tokenInstance.isPublicMintEnabled();
    assert.equal(oldIsPublicMintEnabled, false);
    assert.equal(newIsPublicMintEnabled, true);
  });
  it("set BaseTokenUri from account other than the owner", async () => {
    await tokenInstance.setBaseTokenUri
      .call("https://www.token-uri.com/nft", { from: accounts[1] })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf(
            "revert" >= 0,
            "must be owner to set setBaseTokenUri"
          )
        );
      });
  });

  it("set BaseTokenUri as owner", async () => {
    await tokenInstance.setBaseTokenUri
      .call("https://www.token-uri.com/nft", { from: accounts[0] })
      .then(function (success) {
        assert(success, "it returns true");
      });
  });
  it("mint", async () => {
    // Try to mint with lass value
    await tokenInstance
      .mint(5, { from: accounts[1], value: 10000000000000000 })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf(
            "revert" >= 0,
            "must be owner to set setBaseTokenUri"
          )
        );
      });
    // mint with correct value
      await tokenInstance
      .mint(5, { from: accounts[1], value: 50000000000000000 })
      .then(async (success) => {
       const walletMintsforAcc1 = await tokenInstance.walletMints(accounts[1])
       assert.equal(walletMintsforAcc1.toNumber(), 5);
      });
  });

  // it("tokenURI", async () => {
  //   await tokenInstance.tokenURI(1)
  //     .then(function (success) {
  //       assert.equal(success, "1.json");
  //     });
  // });

});
