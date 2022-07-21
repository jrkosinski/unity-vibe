const Runner = require("./lib/runner");
const tokenAPI = require("./tokenApi"); 

Runner.run(async (provider, owner) => {

    console.log(' * * * ');
    console.log("UnityVibeToken");
    console.log("");

    const token = tokenAPI.instance;

    console.log(await token.totalSupply());
    console.log(await token.balanceOf(owner.address));
});

