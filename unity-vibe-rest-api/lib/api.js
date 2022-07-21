const UnityVibeToken = require("./UnityVibeToken"); 
const token = UnityVibeToken.instance;

module.exports = {
    awardTokens: async (recipAddr, amount) => {
        await token.mintTo(recipAddr, amount); 
    }, 
    
    getBalance: async (address) => {
        return await token.balanceOf(address); 
    }, 
    
    claimUserTokens : async (address, amount) => {
        const allowance = await token.allowance();
        const hasAllowance = (allowance >= amount); 
        if (!hasAllowance) 
            return 0; 
        
        await token.pullFrom(address, amount);
        return amount;
    }
}; 