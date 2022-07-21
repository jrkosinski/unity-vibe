const Deployer = require("./deployer");
const Runner = require("./lib/runner");

Runner.run(async (provider, owner) => {
    
    console.log(' * * * '); 
    console.log("Deploying UnityVibeToken"); 
    console.log(""); 
    
    await Deployer.deployToken(); 
});

