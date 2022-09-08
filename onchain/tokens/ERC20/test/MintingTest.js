const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");
const testEvent = require("./util/testEvent");

describe(constants.TOKEN_CONTRACT_ID + ": Minting", function () {
    let token;				    //contracts
    let owner, addr1, addr2;    //addresses
    
	beforeEach(async function () {
		[owner, addr1, addr2,...addrs] = await ethers.getSigners();
        
        //contract
        token = await deploy.deployToken();
	});
    
    describe("Single Minting", function() {
        it("mint a token to owner", async function () {
            await token.mint(owner.address, 1); 
            
            //owner should have gotten one token 
            expect(await token.balanceOf(owner.address)).to.equal(1); 
            expect(await token.balanceOf(addr1.address)).to.equal(0); 
        }); 
        
        it("mint a token to non-owner", async function () {
            await token.mint(addr1.address, 1); 
            
            //addr1 should have gotten one token 
            expect(await token.balanceOf(addr1.address)).to.equal(1); 
            expect(await token.balanceOf(owner.address)).to.equal(0); 
        }); 
        
        it("non-minter cannot mint token", async function () {
            await expect(token.connect(addr1).mint(
                addr1.address, 1)
            ).to.be.reverted; 
        }); 
        
        it("can mint multiple tokens to same owner", async function () {
            //mint 2 
            await token.mint(addr1.address, 1); 
            await token.mint(addr1.address, 1); 
            
            //addr1 should have 2 
            expect(await token.balanceOf(addr1.address)).to.equal(2); 
            expect(await token.balanceOf(addr2.address)).to.equal(0); 
        }); 
        
        it("can mint multiple tokens to different owners", async function () {
            //mint 1 to each 
            await token.mint(addr1.address, 1); 
            await token.mint(addr2.address, 1); 
            
            //addr1 and addr2 should have one each 
            expect(await token.balanceOf(addr1.address)).to.equal(1); 
            expect(await token.balanceOf(addr2.address)).to.equal(1); 
        }); 
    }); 
    
    describe.skip("Receiver Hook", function () {
        let receiver;
        const BEHAVIOR_ACCEPT = 0;
        const BEHAVIOR_REVERT = 1;
        const BEHAVIOR_REJECT = 2;

        beforeEach(async function () {
            receiver = await deploy.deployReceiver();
        });

        it('receiver is called on mint', async () => {
            await receiver.setBehavior(BEHAVIOR_ACCEPT);
            expect(await token.balanceOf(receiver.address)).to.equal(0);
            await token.mint(receiver.address, 1);

            expect(await token.balanceOf(receiver.address)).to.equal(1);
            expect(await receiver.received()).to.equal(true);
        });

        it('receiver reverts a mint', async () => {
            await receiver.setBehavior(BEHAVIOR_REVERT);
            expect(await token.balanceOf(receiver.address)).to.equal(0);
            await expect(token.mint(receiver.address, 1)).to.be.reverted;

            expect(await receiver.received()).to.equal(false);
        });

        it('receiver rejects a mint', async () => {
            await receiver.setBehavior(BEHAVIOR_REJECT);
            expect(await token.balanceOf(receiver.address)).to.equal(0);
            await expect(token.mint(receiver.address, 1)).to.be.reverted;

            expect(await receiver.received()).to.equal(false);
        });
    }); 

    describe("Events", function () {
        it('transfer event fires on mint', async () => {
            testEvent(async () => await token.mint(addr1.address, 1),
                "Transfer", [owner.address, addr1.address, 1]);
        });
    });
}); 