require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.18",
  paths: {
    sources: "./contracts", // Putanja do izvornih datoteka pametnih ugovora
    artifacts: "./artifacts", // Putanja za spremanje artefakta (ABI)
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
  },
};
