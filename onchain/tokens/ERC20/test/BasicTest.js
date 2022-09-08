const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");

describe(constants.TOKEN_CONTRACT_ID + ": Basic", function () {
    let token;				    //contracts
	let owner, addr1; 		//accounts
	
	beforeEach(async function () {
		[owner, addr1,...addrs] = await ethers.getSigners();
        
        //contract
        token = await deploy.deployToken();
	});
	
	describe("Initial State", function () {
		it("property values", async function () {
            expect(await token.name()).to.equal(constants.TOKEN_NAME); 
            expect(await token.symbol()).to.equal(constants.TOKEN_SYMBOL); 
		});
        
		it("initial token balances", async function () {
            expect(await token.totalSupply()).to.equal(0); 
            expect(await token.balanceOf(owner.address)).to.equal(0); 
            expect(await token.balanceOf(addr1.address)).to.equal(0); 
		});
        
		it("access roles", async function () {
            expect(await token.hasRole(constants.roles.ADMIN, owner.address)).to.equal(true);
            expect(await token.hasRole(constants.roles.MINTER, owner.address)).to.equal(true);
            expect(await token.hasRole(constants.roles.PAUSER, owner.address)).to.equal(true);
            expect(await token.hasRole(constants.roles.ADMIN, addr1.address)).to.equal(false);
            expect(await token.hasRole(constants.roles.MINTER, addr1.address)).to.equal(false);
            expect(await token.hasRole(constants.roles.PAUSER, addr1.address)).to.equal(false);
		});
    });  
});