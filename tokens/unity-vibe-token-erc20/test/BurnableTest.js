const { expect } = require("chai");
const { ethers } = require("hardhat");
const utils = require("../scripts/lib/utils");
const constants = require("./util/constants");
const deploy = require("./util/deploy");

describe("UnityVibeToken: Burning", function () {
    let token;					//contracts
    let owner, addr1, addr2;	//accounts

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        //contract
        token = await deploy.deployToken();
    });

    describe("Burning Tokens", function () {
        it("owner can burn a token", async function () {
            await token.mint(addr1.address, 1);

            expect(await token.balanceOf(addr1.address)).to.equal(1);
            await token.connect(addr1).burn(1);

            expect(await token.balanceOf(addr1.address)).to.equal(0);
        });

        it("non-owner cannot burn another's token without approval", async function () {
            await token.mint(addr1.address, 1);

            expect(await token.balanceOf(addr1.address)).to.equal(1);
            await expect(
                token.connect(addr2).burnFrom(addr1.address, 1)
            ).to.be.reverted;
        });

        it("approved non-owner can burn another's token", async function () {
            await token.mint(addr1.address, 1);

            expect(await token.balanceOf(addr1.address)).to.equal(1);

            //approve addr2 and burn
            await token.connect(addr1).approve(addr2.address, 1);
            await token.connect(addr2).burnFrom(addr1.address, 1);

            expect(await token.balanceOf(addr1.address)).to.equal(0);
            expect(await token.balanceOf(addr2.address)).to.equal(0);
        });
    });
});

//TODO: burning more than balance 
//TODO: burning more than allowance 