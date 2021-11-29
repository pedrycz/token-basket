module.exports = {

  networks: {
     development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      gasPrice: 1,
      gas: 6000000,
     },
  },

  mocha: {
  },

  compilers: {
    solc: {
      version: "0.8.10",
    }
  },

};
