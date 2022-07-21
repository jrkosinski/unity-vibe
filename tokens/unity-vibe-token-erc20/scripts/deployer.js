const utils = require("./lib/utils");
const { ethers } = require("hardhat");

module.exports = {
    deployToken: async () => {
        return await utils.deployContract("UnityVibeToken"); 
    }
};

