const { expect } = require("chai");
const { ethers } = require("hardhat");
const utils = require("../scripts/lib/utils");
const constants = require("./util/constants");
const deploy = require("./util/deploy");

describe(constants.TOKEN_CONTRACT_ID + ": Deployment", function () {
    let token;				    //contracts
	let owner, addr1; 		//accounts
	
	beforeEach(async function () {
		[owner, addr1,...addrs] = await ethers.getSigners();
        
        //contract
        token = await deploy.deployToken();
	});
	
	describe("Initial State", function () {
		it("initial owner", async function () {
            expect(await token.hasRole(constants.roles.ADMIN, owner.address)).to.equal(true);
            expect(await token.hasRole(constants.roles.MINTER, owner.address)).to.equal(true);
            expect(await token.hasRole(constants.roles.PAUSER, owner.address)).to.equal(true);
		});
    });  
	
	describe("Deployment", function () {
		it("ownership transfer on deployment", async function () {
            const contract = await utils.deployContractSilent(constants.TOKEN_CONTRACT_ID, [
                addr1.address, 
                constants.TOKEN_NAME, 
                constants.TOKEN_SYMBOL
            ]);
            
			expect(await contract.hasRole(constants.roles.ADMIN, addr1.address)).to.equal(true);
            expect(await contract.hasRole(constants.roles.MINTER, addr1.address)).to.equal(true);
            expect(await contract.hasRole(constants.roles.PAUSER, addr1.address)).to.equal(true);
            expect(await contract.hasRole(constants.roles.ADMIN, owner.address)).to.equal(false);
            expect(await contract.hasRole(constants.roles.MINTER, owner.address)).to.equal(false);
            expect(await contract.hasRole(constants.roles.PAUSER, owner.address)).to.equal(false);
		});
    });  
});