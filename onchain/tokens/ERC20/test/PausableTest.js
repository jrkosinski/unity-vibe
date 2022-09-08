const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");
const testEvent = require("./util/testEvent");

describe(constants.TOKEN_CONTRACT_ID + ": Pausable", function () {
    let token;				//contracts
	let owner, addr1; 		//accounts
	
	beforeEach(async function () {
		[owner, addr1,...addrs] = await ethers.getSigners();
        
        //contract
        token = await deploy.deployToken();
	});
	
	describe("Initial State", function () {
		it("is not paused initially", async function () {
            expect(await token.paused()).to.equal(false); 
		});		
    });  
	
	describe("Pause can be called", function() {
		it("pauser can pause", async function () {
            await token.pause();
            
            expect(await token.paused()).to.equal(true);
		});
        
        it("pauser can unpause", async function () {
            await token.pause();
            expect(await token.paused()).to.equal(true);
            
            await token.unpause();
            expect(await token.paused()).to.equal(false);
		});
        
		it("cannot unpause when not paused", async function () {
            expect(await token.paused()).to.equal(false);
            await expect(token.unpause()).to.be.revertedWith("Pausable: not paused"); 
        });
        
		it("non-owner cannot pause", async function () {
            await expect(token.connect(addr1).pause()).to.be.reverted; 
		});
	});
	
	describe("Behavior while Paused", function() {        
		it("cannot pause when paused", async function () {
            await token.pause();
            expect(await token.paused()).to.equal(true);
            await expect(token.pause()).to.be.revertedWith("Pausable: paused"); 
		});
        
		it("cannot mint when paused", async function () {
            await token.pause();
            expect(await token.paused()).to.equal(true);
            await expect(token.mint(addr1.address, 1)).to.be.revertedWith("Pausable: paused"); 
            
            //can do it when unpaused 
            await token.unpause(); 
            await expect(token.mint(addr1.address, 1)).to.not.be.reverted;
		});
        
		it("cannot transfer when paused", async function () {
            await token.mint(owner.address, 1); 
            await token.pause();
        
            //cannot do it when paused 
            expect(await token.paused()).to.equal(true);
            await expect(token.transfer(addr1.address, 1)).to.be.revertedWith("Pausable: paused"); 
            
            //can do it when unpaused 
            await token.unpause();
            await expect(token.transfer(addr1.address, 1)).to.not.be.reverted;
        });

        it("cannot approve when paused", async function () {
            await token.mint(owner.address, 1);
            await token.pause();
            expect(await token.paused()).to.equal(true);
            
            await expect(token.approve(addr1.address, 1)).to.be.revertedWith("Pausable: paused");
        });

        it("cannot burn when paused", async function () {
            await token.mint(owner.address, 1);
            await token.pause();
            expect(await token.paused()).to.equal(true);
            
            await expect(token.burn(1)).to.be.revertedWith("Pausable: paused");
        });
    });

    describe("Events", function () {
        it('paused event fires on pause', async () => {
            testEvent(async () => await token.pause(),
                "Paused", [owner.address]);
        });

        it('unpaused event fires on unpause', async () => {
            await token.pause(); 
            testEvent(async () => await token.unpause(),
                "Unpaused", [owner.address]);
        });
    });
});