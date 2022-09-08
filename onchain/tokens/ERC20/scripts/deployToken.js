const Deployer = require("./deployer");
const Runner = require("./lib/runner");
const constants = require("./constants"); 

/**
 * Deploys token contract with initial specified parameters.
 */
Runner.run(async (provider, owner) => {

    console.log(' * * * ');
    console.log("Deploying ", constants.TOKEN_CONTRACT_ID);
    console.log("");

    //deploy NFT contract 
    const token = await Deployer.deployToken();
    console.log(`Token address is ${token.address}`);

    console.log(' * * * ');
    console.log("");
});

