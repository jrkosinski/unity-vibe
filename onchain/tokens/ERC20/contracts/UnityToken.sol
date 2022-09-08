// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract UnityToken is ERC20, ERC20Burnable, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(
        address initialOwner,
        string memory tokenName, 
        string memory tokenSymbol
    ) ERC20(tokenName, tokenSymbol) {
        
        //if an address is passed, it is the owner 
        if (initialOwner == address(0)) 
            initialOwner = msg.sender;
            
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(PAUSER_ROLE, initialOwner);
        _grantRole(MINTER_ROLE, initialOwner);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
    
    function approve(address spender, uint256 amount) public override whenNotPaused returns (bool) {
        return super.approve(spender, amount); 
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev ERC-165 implementation. 
     * 
     * @param _interfaceId An ERC-165 interface id to query. 
     * @return bool Whether or not the interface is supported by this contract. 
     */
    function supportsInterface(bytes4 _interfaceId)
        public
        view
        override(AccessControl)
        returns (bool)
    {
        return 
            _interfaceId == type(IERC20Metadata).interfaceId || 
            _interfaceId == type(IERC20).interfaceId || 
            _interfaceId == type(IERC165).interfaceId || 
        super.supportsInterface(_interfaceId); 
    }
}