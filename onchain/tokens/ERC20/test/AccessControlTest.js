const { expect } = require("chai");
const { ethers } = require("hardhat");
const constants = require("./util/constants");
const deploy = require("./util/deploy");
const testEvent = require("./util/testEvent");

//TODO: make sure every error case is covered 
//TODO: add revertedWith with error msg variables 

describe(constants.TOKEN_CONTRACT_ID + ": Access Control", function () {
	let token;				    //contracts
	let owner, addr1, addr2; 	//accounts
	
	beforeEach(async function () {
		[owner, addr1, addr2,...addrs] = await ethers.getSigners();
        
        //contract
        token = await deploy.deployToken();
	});
	
	describe("Initial State", function () {
		it("default admin role", async function () {
            expect(await token.hasRole(constants.roles.ADMIN, owner.address)).to.equal(true);
            expect(await token.hasRole(constants.roles.ADMIN, addr1.address)).to.equal(false);
            expect(await token.hasRole(constants.roles.ADMIN, addr2.address)).to.equal(false);
		});
        
		it("minter role", async function () {
            expect(await token.hasRole(constants.roles.MINTER, owner.address)).to.equal(true);
            expect(await token.hasRole(constants.roles.MINTER, addr1.address)).to.equal(false);
            expect(await token.hasRole(constants.roles.MINTER, addr2.address)).to.equal(false);
        });

        it("pauser role", async function () {
            expect(await token.hasRole(constants.roles.PAUSER, owner.address)).to.equal(true);
            expect(await token.hasRole(constants.roles.PAUSER, addr1.address)).to.equal(false);
            expect(await token.hasRole(constants.roles.PAUSER, addr2.address)).to.equal(false);
        });
    });  
    
	describe("Managing Roles", function () {
        it("admin can grant a role", async function () {
            await token.grantRole(constants.roles.MINTER, addr1.address); 
            
            expect(await token.hasRole(constants.roles.MINTER, addr1.address)).to.equal(true);
		});
        
        it("admin can revoke a role", async function () {
            await token.grantRole(constants.roles.MINTER, addr1.address); 
            
            expect(await token.hasRole(constants.roles.MINTER, addr1.address)).to.equal(true);
            
            await token.revokeRole(constants.roles.MINTER, addr1.address); 

            expect(await token.hasRole(constants.roles.MINTER, addr1.address)).to.equal(false);
		});
        
        it("anyone can renounce a role", async function () {
            await (token.grantRole(constants.roles.MINTER, addr1.address)); 
            
            expect(await token.hasRole(constants.roles.MINTER, addr1.address)).to.equal(true);
            
            await (token.connect(addr1).renounceRole(constants.roles.MINTER, addr1.address)); 

            expect(await token.hasRole(constants.roles.MINTER, addr1.address)).to.equal(false);
		});
        
		it("transfer ownership", async function () {
            await (token.grantRole(constants.roles.ADMIN, addr1.address)); 
            await (token.renounceRole(constants.roles.ADMIN, owner.address)); 

            expect(await token.hasRole(constants.roles.ADMIN, owner.address)).to.equal(false);
            expect(await token.hasRole(constants.roles.ADMIN, addr1.address)).to.equal(true);
		});
    }); 
    
	describe("Admin Role", function () {
        let admin, nonAdmin; 
        
        beforeEach(async function () {
            await token.grantRole(constants.roles.ADMIN, addr1.address); 
            admin = addr1;
            nonAdmin = addr2; 
        });
        
		it("non-admin cannot grant role", async function () {
            await expect(token.connect(nonAdmin).grantRole(constants.roles.MINTER, admin.address)).to.be.reverted;
            await expect(token.connect(admin).grantRole(constants.roles.MINTER, admin.address)).to.not.be.reverted;
		});
        
		it("non-admin cannot revoke role", async function () {
            await expect(token.connect(nonAdmin).revokeRole(constants.roles.MINTER, owner.address)).to.be.reverted;
            await expect(token.connect(admin).revokeRole(constants.roles.MINTER, owner.address)).to.not.be.reverted;
		});
    });

    describe("Pauser Role", function () {
        let admin, nonPauser;

        beforeEach(async function () {
            await token.grantRole(constants.roles.PAUSER, addr1.address);
            admin = addr1;
            nonPauser = addr2;
        });

        it("non-pauser cannot pause", async function () {
            await expect(token.connect(nonPauser).pause()).to.be.reverted;
            await expect(token.connect(admin).pause()).to.not.be.reverted;
        });

        it("non-pauser cannot unpause", async function () {
            await token.connect(addr1).pause();
            await expect(token.connect(nonPauser).unpause()).to.be.reverted;
            await expect(token.connect(admin).unpause()).to.not.be.reverted;
        });
    }); 
    
	describe("Minter Role", function () {
        
		it("initial owner/admin can mint", async function () {
            await token.mint(owner.address, 1); 
            expect(await token.balanceOf(owner.address)).to.equal(1); 
		});
        
		it("non-minter cannot mint", async function () {
            await expect(token.connect(addr1).mint(addr1.address, 1)).to.be.reverted;
		});
        
        it("minter role can mint", async function () {
            const minter = addr1; 
            
            await (token.grantRole(constants.roles.MINTER, minter.address)); 
            await token.connect(minter).mint(minter.address, 1); 
            expect(await token.balanceOf(minter.address)).to.equal(1); 
        });

        it("minter role can mint multiple", async function () {
            const minter = addr1; 
            
            await (token.grantRole(constants.roles.MINTER, minter.address));
            await token.connect(minter).mint(minter.address, 3);
            expect(await token.balanceOf(minter.address)).to.equal(3);
        });
    });

    describe("Events", function () {
        it('rolegranted event fires on grantRole', async () => {
            testEvent(async () => await token.grantRole(constants.roles.MINTER, addr1.address),
                "RoleGranted", [constants.roles.MINTER, addr1.address, owner.address]);
        });

        it('rolerevoked event fires on revokeRole', async () => {
            await (token.grantRole(constants.roles.MINTER, addr1.address)); 

            testEvent(async () => await token.revokeRole(constants.roles.MINTER, addr1.address),
                "RoleRevoked", [constants.roles.MINTER, addr1.address, owner.address]);
        });
    });
});