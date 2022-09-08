const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");

describe(constants.TOKEN_CONTRACT_ID + ": Supply Constraints", function () {		  
	let nft;				        //contracts
	let owner, addr1, addr2; 		//accounts
	
	beforeEach(async function () {
		[owner, addr1, addr2,...addrs] = await ethers.getSigners();
        
        //contract
        token = await deploy.deployToken();
	});
    
	describe("Initial State", function () {
		it("property values", async function () {
            expect(await token.totalSupply()).to.equal(0); 
		});
    });  
    
	describe("Total Supply", function () {
		it("totalSupply increases on minting", async function () {
            const mintAmount = 1000; 
            await token.mint(owner.address, mintAmount); 
            expect(await token.totalSupply()).to.equal(mintAmount); 

            await token.mint(owner.address, mintAmount);
            expect(await token.totalSupply()).to.equal(mintAmount * 2); 
		});
        
        it("totalSupply decreases on burning", async function () {
            const mintAmount = 1000;
            const burnAmount = 200; 
            await token.mint(owner.address, mintAmount);
            expect(await token.totalSupply()).to.equal(mintAmount);

            await token.burn(burnAmount);
            expect(await token.totalSupply()).to.equal(mintAmount - burnAmount); 
		});

        it("totalSupply unaffected by transferring", async function () {
            const mintAmount = 1000;
            const transferAmount = 200;
            await token.mint(owner.address, mintAmount);
            expect(await token.totalSupply()).to.equal(mintAmount);

            await token.transfer(addr1.address, transferAmount);
            expect(await token.totalSupply()).to.equal(mintAmount); 
        });
    });
});