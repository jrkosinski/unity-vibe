const { expect } = require("chai");
const { ethers } = require("hardhat");
const utils = require("../scripts/lib/utils");
const constants = require("./util/constants");
const deploy = require("./util/deploy");

const INITIAL_MINT = 100;

describe("UnityVibeToken: Transferring", function () {		  
    let token;					//contracts
      let owner, addr1, addr2;	//accounts
	
	beforeEach(async function () {
		[owner, addr1, addr2,...addrs] = await ethers.getSigners();
        
        //contract
		token = await deploy.deployToken();
        
        //mint an initial supply to owner 
        token.mint(owner.address, INITIAL_MINT); 
	});
	
	describe("Initial State", function() { 
		it("initial balances", async function () {
            expect(await token.totalSupply()).to.equal(INITIAL_MINT); 
            expect(await token.balanceOf(owner.address)).to.equal(INITIAL_MINT); 
		});
	});
	
	describe("Simple Transfer", function() {
		it("transfer full balance to another party", async function () {
            await token.transfer(addr1.address, await token.balanceOf(owner.address)); 
            
            expect(await token.totalSupply()).to.equal(INITIAL_MINT); 
            expect(await token.balanceOf(owner.address)).to.equal(0); 
            expect(await token.balanceOf(addr1.address)).to.equal(INITIAL_MINT); 
		});
        
		it("transfer partial balance to another party", async function () {
            const transferAmt = 25;
            await token.transfer(addr1.address, transferAmt); 
            
            expect(await token.totalSupply()).to.equal(INITIAL_MINT); 
            expect(await token.balanceOf(owner.address)).to.equal(INITIAL_MINT - transferAmt); 
            expect(await token.balanceOf(addr1.address)).to.equal(transferAmt); 
		});
        
		it("transfer and transfer again", async function () {
            const transferAmt1 = 40;
            const transferAmt2 = 20;
            
            //first transfer
            await token.transfer(addr1.address, transferAmt1); 
            
            expect(await token.totalSupply()).to.equal(INITIAL_MINT); 
            expect(await token.balanceOf(owner.address)).to.equal(INITIAL_MINT - transferAmt1); 
            expect(await token.balanceOf(addr1.address)).to.equal(transferAmt1); 
            expect(await token.balanceOf(addr2.address)).to.equal(0); 
            
            //second transfer
            await token.connect(addr1).transfer(addr2.address, transferAmt2); 
            
            expect(await token.totalSupply()).to.equal(INITIAL_MINT); 
            expect(await token.balanceOf(owner.address)).to.equal(INITIAL_MINT - transferAmt1); 
            expect(await token.balanceOf(addr1.address)).to.equal(transferAmt1 - transferAmt2); 
            expect(await token.balanceOf(addr2.address)).to.equal(transferAmt2); 
		});
        
		it("multiple transfer on top of existing balance", async function () {
            const transferAmt1 = 60;
            const transferAmt2 = 35;
            const transferAmt3 = 24;
            const transferAmt4 = 11;
            
            //first transfer
            await token.transfer(addr1.address, transferAmt1); 
            
            expect(await token.totalSupply()).to.equal(INITIAL_MINT); 
            expect(await token.balanceOf(owner.address)).to.equal(INITIAL_MINT - transferAmt1); 
            expect(await token.balanceOf(addr1.address)).to.equal(transferAmt1); 
            expect(await token.balanceOf(addr2.address)).to.equal(0); 
            
            //second transfer
            await token.connect(addr1).transfer(addr2.address, transferAmt2); 
            
            expect(await token.totalSupply()).to.equal(INITIAL_MINT); 
            expect(await token.balanceOf(owner.address)).to.equal(INITIAL_MINT - transferAmt1); 
            expect(await token.balanceOf(addr1.address)).to.equal(transferAmt1 - transferAmt2); 
            expect(await token.balanceOf(addr2.address)).to.equal(transferAmt2); 
            
            //third transfer
            await token.connect(addr2).transfer(addr1.address, transferAmt3); 
            
            expect(await token.totalSupply()).to.equal(INITIAL_MINT); 
            expect(await token.balanceOf(owner.address)).to.equal(INITIAL_MINT - transferAmt1); 
            expect(await token.balanceOf(addr1.address)).to.equal(transferAmt1 - transferAmt2 + transferAmt3); 
            expect(await token.balanceOf(addr2.address)).to.equal(transferAmt2 - transferAmt3); 
            
            //fourth transfer
            await token.transfer(addr1.address, transferAmt4); 
            
            expect(await token.totalSupply()).to.equal(INITIAL_MINT); 
            expect(await token.balanceOf(owner.address)).to.equal(INITIAL_MINT - transferAmt1 - transferAmt4); 
            expect(await token.balanceOf(addr1.address)).to.equal(transferAmt1 - transferAmt2 + transferAmt3 + transferAmt4); 
            expect(await token.balanceOf(addr2.address)).to.equal(transferAmt2 - transferAmt3); 
		});
	});
	
	describe("Approve", function() {
        beforeEach(async function () {
            await token.transfer(addr1.address, INITIAL_MINT); 
        });
        
		it("initial state: no approvals", async function () {
            const approveAmt = 35;
            
            expect(await (token.allowance(addr1.address, addr2.address))).to.equal(0);
            expect(await (token.allowance(addr1.address, owner.address))).to.equal(0);
		});
        
		it("anyone can approve a spender", async function () {
            const approveAmt = 35;
            await token.connect(addr1).approve(addr2.address, approveAmt); 
            
            expect(await (token.allowance(addr1.address, addr2.address))).to.equal(approveAmt);
            expect(await (token.allowance(addr1.address, owner.address))).to.equal(0);
		});
        
		it("approve multiple spenders", async function () {
            const approveAmt1 = 25;
            const approveAmt2 = 15;
            
            await token.connect(addr1).approve(addr2.address, approveAmt1); 
            await token.connect(addr1).approve(owner.address, approveAmt2); 
            
            expect(await (token.allowance(addr1.address, addr2.address))).to.equal(approveAmt1);
            expect(await (token.allowance(addr1.address, owner.address))).to.equal(approveAmt2);
		});
        
		it("increase allowance", async function () {
            const approveAmt1 = 10;
            const approveInc = 12;
            await token.connect(addr1).approve(addr2.address, approveAmt1); 
            await token.connect(addr1).increaseAllowance(addr2.address, approveInc); 
            
            expect(await (token.allowance(addr1.address, addr2.address))).to.equal(approveAmt1 + approveInc);
            expect(await (token.allowance(addr1.address, owner.address))).to.equal(0);
		});
        
		it("decrease allowance", async function () {
            const approveAmt1 = 10;
            const approveDec = 2;
            await token.connect(addr1).approve(addr2.address, approveAmt1); 
            await token.connect(addr1).decreaseAllowance(addr2.address, approveDec); 
            
            expect(await (token.allowance(addr1.address, addr2.address))).to.equal(approveAmt1 - approveDec);
            expect(await (token.allowance(addr1.address, owner.address))).to.equal(0);
		});
        
		it("can approve more than balance", async function () {
            await token.approve(addr1.address, INITIAL_MINT+1);
            
            expect(await token.allowance(owner.address, addr1.address)).to.equal(INITIAL_MINT+1);
		});
        
		it("can approve self as spender", async function () {
            await token.approve(owner.address, INITIAL_MINT);
		});
	});
	
	describe("Approve and Transfer", function() {
		it("can approve and transfer to self", async function () {
            const approveAmt = 40;
            
            await token.approve(addr1.address, approveAmt);
            await token.connect(addr1).transferFrom(owner.address, addr1.address, approveAmt);
            
            expect(await token.balanceOf(owner.address)).to.equal(INITIAL_MINT - approveAmt); 
            expect(await token.balanceOf(addr1.address)).to.equal(approveAmt); 
            expect(await token.balanceOf(addr2.address)).to.equal(0); 
		});
        
		it("can approve and transfer to another", async function () {
            const approveAmt = 40;
            
            await token.approve(addr1.address, approveAmt);
            await token.connect(addr1).transferFrom(owner.address, addr2.address, approveAmt);
            
            expect(await token.balanceOf(owner.address)).to.equal(INITIAL_MINT - approveAmt); 
            expect(await token.balanceOf(addr1.address)).to.equal(0); 
            expect(await token.balanceOf(addr2.address)).to.equal(approveAmt); 
		});
        
		it("can approve and transfer part of allowance", async function () {
            const approveAmt = 40;
            const claimAmt = 13;
            
            await token.approve(addr1.address, approveAmt);
            await token.connect(addr1).transferFrom(owner.address, addr1.address, claimAmt);
            
            expect(await token.balanceOf(owner.address)).to.equal(INITIAL_MINT - claimAmt); 
            expect(await token.balanceOf(addr1.address)).to.equal(claimAmt); 
            expect(await token.balanceOf(addr2.address)).to.equal(0); 
		});
	});
	
	describe("Exceptional Cases", function() {
		it("transfer more than balance", async function () {
            await expect(token.transfer(addr1.address, INITIAL_MINT+1)).to.be.reverted;
		});
        
		it("approve and rug-pull", async function () {
            //approve one address
            await token.approve(addr1.address, INITIAL_MINT); 
            
            //then transfer to another 
            await token.transfer(addr2.address, INITIAL_MINT); 
            
            //address 1 tries to claim part of their allowance 
            await expect(token.connect(addr1).transferFrom(owner.address, addr1.address, 1)).to.be.reverted;
		});
        
		it("cannot claim more than allowance", async function () {
            const approveAmt = 10;
            await token.approve(addr1.address, approveAmt); 
            await expect(token.connect(addr1).transferFrom(owner.address, addr1.address, approveAmt+1)).to.be.reverted;
		});
	});
});