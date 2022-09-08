const { ethers } = require("hardhat");

module.exports = {
    //general utility
    TOKEN_CONTRACT_ID: "UnityToken",
    MINTER_ROLE: "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    PAUSER_ROLE: "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a",
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000", 

    //if token is already deployed, put its address here 
    TOKEN_ADDRESS: "0x212348c9Daf7EC21Fa1d04C257a2941f9e336deF",
    
    //token details 
    TOKEN_NAME: "UnityToken",
    TOKEN_SYMBOL: "UTK", 
}; 