const Certificate = artifacts.require("Certificate");

contract("Certificate", (accounts) => {
  const [user1] = accounts;

  it("should register a user and store hash", async () => {
    const cert = await Certificate.deployed();

    const username = "alice";
    const email = "alice@example.com";

    await cert.registerUser(username, email, { from: user1 });

    const userHash = await cert.getUserHash(user1);
    const expectedHash = web3.utils.keccak256(web3.eth.abi.encodeParameters(
      ['string', 'string'],
      [username, email]
    ));

    assert.equal(userHash, expectedHash, "The hash stored on-chain is incorrect");
  });
});
