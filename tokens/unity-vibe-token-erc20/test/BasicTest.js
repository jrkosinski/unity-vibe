const { expect } = require("chai");
const { ethers } = require("hardhat");
const utils = require("../scripts/lib/utils");
const constants = require("./util/constants");
const deploy = require("./util/deploy");

describe("UnityVibeToken: Basic", function () {		  
	let token;				//contracts
	let owner, addr1; 		//accounts
	
	beforeEach(async function () {
		[owner, addr1,...addrs] = await ethers.getSigners();
        
        //contract
		token = await deploy.deployToken();
	});
	
	describe("Initial State", function () {
		it("property values", async function () {
			expect(await token.name()).to.equal(constants.NAME); 
			expect(await token.symbol()).to.equal(constants.SYMBOL); 
		});
        
		it("balances", async function () {
			expect(await token.totalSupply()).to.equal(0); 
			expect(await token.balanceOf(owner.address)).to.equal(0); 
			expect(await token.balanceOf(addr1.address)).to.equal(0); 
		});
    }); 
});