import { BigNumber } from 'ethers'; 

export class TokenInfo {
    symbol: String; 
    quantity: BigNumber;
    
    constructor(sym: String, q: BigNumber) {
        this.symbol = sym; 
        this.quantity = q; 
    }
}

export interface Server {
    getTokens(address: String) : Promise<TokenInfo[]>;
    awardTokens(address: String, quantity: Number): Promise<TokenInfo[]>;
}; 