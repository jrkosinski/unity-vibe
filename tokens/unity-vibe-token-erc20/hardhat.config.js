require("@nomiclabs/hardhat-waffle");
require("solidity-coverage"); 

const ALCHEMY_API_KEY = "<YOUR_API_KEY>";
const RINKEBY_PRIVATE_KEY = "<YOUR_PRIV_KEY>";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`]
    }
  }
};



