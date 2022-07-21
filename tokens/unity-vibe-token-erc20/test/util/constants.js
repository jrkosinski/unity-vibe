module.exports = {
    NAME : "UnityVibeToken", 
    SYMBOL : "UVT", 
    NULL_ADDRESS : "0x0000000000000000000000000000000000000000",
    
    roles: {
        ADMIN: ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32),
        PAUSER: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PAUSER_ROLE")),
        MINTER: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")) //'0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
    }, 
    
    //TODO: can these be calculated? 
    interfaceIds : {
        IERC2981:           "0x2a55205a", 
        IERC165:            "0x01ffc9a7", 
        IAccessControl:     "0x7965db0b", 
        IERC721:            "0x80ac58cd", 
        IERC721Enumerable:  "0x780e9d63", 
        IERC20:             "0x36372b07", 
        IERC777:            "0xe58e113c"
    }
};