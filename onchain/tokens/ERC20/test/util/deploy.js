const constants = require("./constants");
const utils = require("../../scripts/lib/utils");

module.exports = {
    deployToken : async () => {
		return await utils.deployContractSilent(constants.TOKEN_CONTRACT_ID, [
            constants.ZERO_ADDRESS,
            constants.TOKEN_NAME, 
            constants.TOKEN_SYMBOL
        ]); 
    }
};