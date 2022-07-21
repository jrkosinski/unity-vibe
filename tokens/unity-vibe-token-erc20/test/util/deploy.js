
const constants = require("./constants");
const utils = require("../../scripts/lib/utils");

module.exports = {
    deployToken : async () => {
		return await utils.deployContractSilent("UnityVibeToken"); 
    }
};