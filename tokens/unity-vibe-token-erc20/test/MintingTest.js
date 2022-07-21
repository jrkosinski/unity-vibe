const { expect } = require("chai");
const { ethers } = require("hardhat");
const utils = require("../scripts/lib/utils");
const constants = require("./util/constants");
const deploy = require("./util/deploy");

describe("UnityVibeToken: Minting", function () {
    let token;                    //contracts
    let owner, addr1, addr2;      //addresses
    
	beforeEach(async function () {
		[owner, addr1, addr2,...addrs] = await ethers.getSigners();
        
        //contract
		token = await deploy.deployToken();
	});
    
    describe("Minting", function() {
        it("mint a token to owner", async function () {
            await token.mint(owner.address, 1); 
            
            expect(await token.totalSupply()).to.equal(1); 
            expect(await token.balanceOf(owner.address)).to.equal(1);
            expect(await token.balanceOf(addr1.address)).to.equal(0);
        }); 
        
        it("mint a token to non-owner", async function () {
            await token.mint(addr1.address, 1); 
            
            expect(await token.totalSupply()).to.equal(1); 
            expect(await token.balanceOf(owner.address)).to.equal(0);
            expect(await token.balanceOf(addr1.address)).to.equal(1);
        }); 
        
        it("can mint multiple tokens to owner", async function () {
            const amount = 9999999;
            await token.mint(owner.address, amount); 
            
            expect(await token.totalSupply()).to.equal(amount); 
            expect(await token.balanceOf(owner.address)).to.equal(amount);
            expect(await token.balanceOf(addr1.address)).to.equal(0);
        }); 
        
        it("can mint multiple tokens to non owners", async function () {
            const amount = 9999999;
            await token.mint(addr1.address, amount); 
            
            expect(await token.totalSupply()).to.equal(amount); 
            expect(await token.balanceOf(owner.address)).to.equal(0);
            expect(await token.balanceOf(addr1.address)).to.equal(amount);
        }); 
        
        it("can mint multiple tokens to multiple owners", async function () {
            const amount1 = 9999999;
            const amount2 = 1111;
            const amount3 = 343434;
            
            await token.mint(owner.address, amount1); 
            await token.mint(addr1.address, amount2); 
            await token.mint(addr2.address, amount3); 
            
            expect(await token.balanceOf(owner.address)).to.equal(amount1);
            expect(await token.balanceOf(addr1.address)).to.equal(amount2);
            expect(await token.balanceOf(addr2.address)).to.equal(amount3);
            expect(await token.totalSupply()).to.equal(amount1 + amount2 + amount3); 
        }); 
        
        it("can increase balance by minting", async function () {
            const amount1 = 9999999;
            const amount2 = 1111;
            
            await token.mint(addr1.address, amount1); 
            expect(await token.balanceOf(addr1.address)).to.equal(amount1);
            expect(await token.totalSupply()).to.equal(amount1); 
            
            await token.mint(addr1.address, amount2); 
            expect(await token.balanceOf(addr1.address)).to.equal(amount1 + amount2);
            expect(await token.totalSupply()).to.equal(amount1 + amount2); 
        }); 
    }); 
}); 