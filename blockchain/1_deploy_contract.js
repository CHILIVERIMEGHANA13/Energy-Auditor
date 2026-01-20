const Certificate = artifacts.require("Certificate");

module.exports = function (deployer) {
  deployer.deploy(Certificate)
    .then(() => {
      console.log('Contract deployed at:', Certificate.address);
    });
}; 