const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");
const testEvent = require("./util/testEvent"); 

//TODO: test increaseAllowance and decreaseAllowance

describe(constants.TOKEN_CONTRACT_ID + ": Transferring", function () {
    let token;				    //contracts
	let owner, addr1, addr2;	//accounts
    const initialMint = 10000; 
	
	beforeEach(async function () {
		[owner, addr1, addr2,...addrs] = await ethers.getSigners();
        
        //contract
        token = await deploy.deployToken();
        
        //mint to owner 
        token.mint(owner.address, initialMint); 
	});
	
	describe("Initial State", function() { 
        it("Initial balances", async function () {
            //owner has been minted tokens
            expect(await token.balanceOf(owner.address)).to.equal(initialMint); 
		});
	});
	
	describe("Simple Transfer", function() {
		it("owner can transfer tokens", async function () {
            const amount = 1000; 
            await token.transfer(addr1.address, amount); 
            
            //check that transfer was credited and debited
            expect(await token.balanceOf(owner.address)).to.equal(initialMint - amount); 
            expect(await token.balanceOf(addr1.address)).to.equal(amount); 
		});
          
        it("double transfer without data", async function () {
            const amount1 = 1000;
            const amount2 = 500;
            await token.transfer(addr1.address, amount1); 
            
            //then transfer them from addr1 to addr2
            await token.connect(addr1).transfer(addr2.address, amount2); 

            //check that transfer was credited and debited accordingly
            expect(await token.balanceOf(owner.address)).to.equal(initialMint - amount1); 
            expect(await token.balanceOf(addr1.address)).to.equal(amount1 - amount2); 
            expect(await token.balanceOf(addr2.address)).to.equal(amount2); 
		});
	});
	
    describe("Approve and Transfer", function() {
        describe("Approve Single", function () {
            it("owner can approve", async function () {
                await token.approve(addr1.address, 1);
            });

            it("approve and transfer", async function () {
                const amount = 100; 
                await token.approve(addr1.address, amount);
                await token.connect(addr1).transferFrom(owner.address, addr1.address, amount);

                //check that transfer was credited and debited
                expect(await token.balanceOf(owner.address)).to.equal(initialMint - amount);
                expect(await token.balanceOf(addr1.address)).to.equal(amount);
            });

            it("approve and transfer to a third user", async function () {
                const amount = 100;
                await token.approve(addr1.address, amount);
                
                await token.connect(addr1).transferFrom(owner.address, addr2.address, amount);

                //check that transfer was credited and debited
                expect(await token.balanceOf(owner.address)).to.equal(initialMint - amount);
                expect(await token.balanceOf(addr1.address)).to.equal(0);
                expect(await token.balanceOf(addr2.address)).to.equal(amount);
            });

            it("cannot approve and double transfer", async function () {
                const amount = 100; 
                await token.approve(addr1.address, amount);

                //transfer from owner to addr2, using addr1 as middleman after approval
                await token.connect(addr1).transferFrom(owner.address, addr2.address, amount);

                //try to transfer another one
                await expect(
                    token.connect(addr1).transferFrom(addr2.address, addr1.address, 1)
                ).to.be.revertedWith("ERC20: insufficient allowance");

                expect(await token.balanceOf(owner.address)).to.equal(initialMint - amount);
                expect(await token.balanceOf(addr2.address)).to.equal(amount);
            });

            it("approval clears on transfer by owner", async function () {
                await token.approve(addr1.address, initialMint);

                await token.transfer(addr2.address, initialMint);
                await expect(
                    token.connect(addr1).transferFrom(owner.address, addr1.address, 1)
                ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
            });
        }); 
	});

    describe("Events", function () {
        it('transfer event fires on transfer', async () => {
            testEvent(async () => await token.transfer(addr1.address, 100),
                "Transfer", [owner.address, addr1.address, 100]);
        });

        it('approve event fires on approve', async () => {
            testEvent(async () => await token.approve(addr1.address, 10),
                "Approve", [owner.address, addr1.address, 10]);
        });
        
        it('transfer event fires on transferFrom', async () => {
            await token.approve(addr1.address, 10); 
            testEvent(async () => await token.transferFrom(addr1.address, addr2.address, 100),
                "Transfer", [owner.address, addr1.address, 100]);
        });
    });
});