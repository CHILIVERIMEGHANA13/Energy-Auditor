const Minimal = artifacts.require("Minimal");

module.exports = function (deployer) {
  deployer.deploy(Minimal)
    .then(() => {
      console.log('Minimal contract deployed at:', Minimal.address);
    });
}; 