const { ethers } = require("hardhat");

const TOKEN_ADDR = "0x15222dB2235Ce0e20eA190e2aB21999e2e14DbF2"; 

const securityRoles = {
    ADMIN: ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32),
    PAUSER: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PAUSER_ROLE")),
    MINTER: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"))
}; 

//TODO: rewrite in typeScript 

//TODO: unit tests for API 
class UnityVibeToken {
    constructor(addr) {
        this.address = addr;
        this._contract = null; 
    }
    
    async _init() {
        if (!this._contract) {
            const [owner, addr1, addr2] = await ethers.getSigners();
            this._owner = owner;
            this._contract = await ethers.getContractAt("UnityVibeToken", this.address); 
        }
    }
    
    async mint(amount) {
        await this._init(); 
        this.mintTo(this._owner.address, amount); 
    }

    //TODO: seems to not be working
    async burn(amount) {
        await this._init();
        this._contract.burn(amount);
    }
    
    async mintTo(addr, amount) {
        await this._init(); 
        await this._contract.mint(addr, amount); 
    }
    
    async pause() {
        await this._init(); 
        await this._contract.pause(); 
    }
    
    async unpause() {
        await this._init(); 
        await this._contract.unpause(); 
    }
    
    async paused() {
        await this._init(); 
        return await this._contract.paused();
    }
    
    async grantRole(addr, role) {
        await this._init(); 
        await this._contract.grantRole(role, addr); 
    }

    async revokeRole(addr, role) {
        await this._init(); 
        await this._contract.revokeRole(role, addr); 
    }

    async renounceRole(role) {
        await this._init(); 
        await this._contract.renounceRole(role); 
    }
    
    async transferAdmin() {
        await this._init(); 
        await this.grantRole(addr, securityRoles.ADMIN); 
        if (await this._contract.hasRole(securityRoles.ADMIN, addr)) {
            await this.renounceRole(securityRoles.ADMIN); 
        }
    }
    
    async totalSupply() {
        await this._init(); 
        return await this._contract.totalSupply();
    }
    
    async balanceOf(addr) {
        await this._init(); 
        return await this._contract.balanceOf(addr);
    }
}

module.exports = {
    instance : new UnityVibeToken(TOKEN_ADDR), 
    
    securityRoles: securityRoles
}