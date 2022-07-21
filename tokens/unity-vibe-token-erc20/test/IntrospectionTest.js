const { expect } = require("chai");
const { ethers } = require("hardhat");
const utils = require("../scripts/lib/utils");
const constants = require("./util/constants");
const deploy = require("./util/deploy");

describe("UnityVibeToken: Introspection (ERC-165)", function () {		  
	let token;				//contracts
	let owner, addr1; 		//accounts
	
	beforeEach(async function () {
		[owner, addr1,...addrs] = await ethers.getSigners();
        
        //contract
		token = await deploy.deployToken();
	});

	describe("Supports Interfaces", function () {
		it("supports correct interfaces: IERC20", async function () {
            expect(await token.supportsInterface(constants.interfaceIds.IERC20)).to.equal(true); 
        });

        it("supports correct interfaces: IERC165", async function () {
            expect(await token.supportsInterface(constants.interfaceIds.IERC165)).to.equal(true);
        });

        it("supports correct interfaces: IAccessControl", async function () {
            expect(await token.supportsInterface(constants.interfaceIds.IAccessControl)).to.equal(true); 
        });

		it("doesn't support incorrect interfaces", async function () {
            expect(await token.supportsInterface("0x00000000")).to.equal(false); 
            expect(await token.supportsInterface(constants.interfaceIds.IERC721)).to.equal(false); 
            expect(await token.supportsInterface(constants.interfaceIds.IERC721Enumerable)).to.equal(false); 
            expect(await token.supportsInterface(constants.interfaceIds.IERC777)).to.equal(false); 
            expect(await token.supportsInterface(constants.interfaceIds.IERC2981)).to.equal(false); 
		});
    });  
});