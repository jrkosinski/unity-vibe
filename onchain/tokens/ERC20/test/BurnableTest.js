const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");
const testEvent = require("./util/testEvent");

describe(constants.TOKEN_CONTRACT_ID + ": Burning", function () {
    let token;				    //contracts
	let owner, addr1, addr2;	//accounts
	
	beforeEach(async function () {
		[owner, addr1, addr2,...addrs] = await ethers.getSigners();
        
        //contract
        token = await deploy.deployToken();
	});
	
	describe("Burning Tokens", function() {        
		it("owner can burn a token", async function () {
            await token.mint(addr1.address, 1); 
            
            //owner burns a token 
            expect(await token.balanceOf(addr1.address)).to.equal(1); 
            await token.connect(addr1).burn(1); 
			
            //expect balance to be zero 
            expect(await token.balanceOf(addr1.address)).to.equal(0); 
		});
		
        it("cannot burn more than balance", async function () {
            //balance is zero; cannot burn any
            await expect(
                token.connect(addr1).burn(1)
            ).to.be.revertedWith("ERC20: burn amount exceeds balance"); 
            
            //mint a few 
            await token.mint(addr1.address, 4); 
			
            //expect attempt to be reverted 
			await expect(
                token.connect(addr1).burn(11)
            ).to.be.revertedWith("ERC20: burn amount exceeds balance"); 
        });

        it("cannot burn another's token without approval", async function () {
            await token.mint(addr1.address, 1);
            expect(await token.balanceOf(addr1.address)).to.equal(1); 

            //approve addr2 and burn
            await expect(
                token.connect(addr2).burnFrom(addr1.address, 1)
            ).to.be.revertedWith("ERC20: insufficient allowance"); 
        });
		
		it("approved non-owner can burn another's token", async function () {
            await token.mint(addr1.address, 1);
            expect(await token.balanceOf(addr1.address)).to.equal(1); 
			
			//approve addr2 and burn
            await token.connect(addr1).approve(addr2.address, 1); 
            
            await token.connect(addr2).burnFrom(addr1.address, 1);
            expect(await token.balanceOf(addr1.address)).to.equal(0); 
        });
        
        it("cannot burn non-existent token", async () => {
            await expect(token.connect(addr1).burn(1)).to.be.reverted;
        });
    });

    describe("Events", function () {
        it('transfer event fires on burn', async () => {
            await token.mint(addr1.address, 1);

            testEvent(async () => await token.connect(addr1).burn(1),
                "Transfer", [addr1.address, 0, 1]);
        });
    });
});