module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 6721975,
      gasPrice: 20000000000,
      from: null // Will use the first account as default
    }
  },

  mocha: {
    timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.0",  // Use the version your contract was written in
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  

  // Truffle DB is optional and disabled by default
  // db: {
  //   enabled: false,
  // },
};
