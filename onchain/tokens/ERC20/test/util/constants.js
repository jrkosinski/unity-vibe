module.exports = {

    //general utility
    TOKEN_CONTRACT_ID: "UnityToken",
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",

    //if token is already deployed, put its address here 
    TOKEN_ADDRESS: "<INSERT_TOKEN_ADDRESS_HERE>",

    //token details 
    TOKEN_NAME: "UnityToken",
    TOKEN_SYMBOL: "UTK", 
    
    roles: {
        ADMIN: ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32),
        MINTER: '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6', 
        PAUSER: '0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a'
    }, 
    
    interfaceIds : {
        IERC2981:           "0x2a55205a", 
        IERC165:            "0x01ffc9a7", 
        IAccessControl:     "0x7965db0b", 
        IERC721:            "0x80ac58cd", 
        IERC721Enumerable:  "0x780e9d63", 
        IERC20:             "0x36372b07", 
        IERC20Metadata:     "0xa219a025", 
        IERC777:            "0xe58e113c"
    }
};
