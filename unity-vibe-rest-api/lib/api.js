const UnityVibeToken = require("./UnityVibeToken"); 
const token = UnityVibeToken.instance;

module.exports = {
    awardTokens: async (recipAddr, amount) => {
        await token.mintTo(recipAddr, amount); 
    }, 
    
    getBalance: async (address) => {
        return await token.balanceOf(address); 
    }
}; 