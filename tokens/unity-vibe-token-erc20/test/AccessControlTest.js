const { expect } = require("chai");
const { ethers } = require("hardhat");
const utils = require("../scripts/lib/utils");
const constants = require("./util/constants");
const deploy = require("./util/deploy");

describe("UnityVibeToken: Access Control", function () {		  
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
    });

    describe("Managing Roles", function () {
        it("admin can grant a role", async function () {
            await (token.grantRole(constants.roles.MINTER, addr1.address));

            expect(await token.hasRole(constants.roles.MINTER, addr1.address)).to.equal(true);
        });

        it("admin can revoke a role", async function () {
            await (token.grantRole(constants.roles.MINTER, addr1.address));

            expect(await token.hasRole(constants.roles.MINTER, addr1.address)).to.equal(true);

            await (token.revokeRole(constants.roles.MINTER, addr1.address));

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
        beforeEach(async function () {
            await token.grantRole(constants.roles.ADMIN, addr1.address);
        });

        it("non-admin cannot grant role", async function () {
            await expect(token.connect(addr2).grantRole(constants.roles.MINTER, addr1.address)).to.be.reverted;
            await expect(token.connect(addr1).grantRole(constants.roles.MINTER, addr1.address)).to.not.be.reverted;
        });

        it("non-admin cannot revoke role", async function () {
            await expect(token.connect(addr2).revokeRole(constants.roles.MINTER, owner.address)).to.be.reverted;
            await expect(token.connect(addr1).revokeRole(constants.roles.MINTER, owner.address)).to.not.be.reverted;
        });

        it("only pauser can pause", async function () {
            await token.grantRole(constants.roles.PAUSER, addr1.address);

            await expect(token.connect(addr2).pause()).to.be.reverted;
            await expect(token.connect(addr1).pause()).to.not.be.reverted;
            
            expect(await token.paused()).to.be.true;
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
            await (token.grantRole(constants.roles.MINTER, addr1.address));
            await token.connect(addr1).mint(addr1.address, 1);
            expect(await token.balanceOf(addr1.address)).to.equal(1);
        });
    });
});