import { IServer, TokenInfo } from "./IServer";
import { BigNumber } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

export default class MockServer implements IServer {
    validAddress: string = "0xcEa845CA58C8dD4369810c3b5168C49Faa34E6F3"; 
    
    async getTokens(address: String): Promise<TokenInfo[]> {
        if (address.toLowerCase() == this.validAddress.toLowerCase()) {
            let output: TokenInfo[] = new Array();
            output.push(new TokenInfo("UTK", BigNumber.from("33")));
            return output;
        }
        else {
            return [];
        }
    }

    async awardTokens(address: String, tokenAddress: String, quantity: Number): Promise<TokenInfo[]>  {
        let output: TokenInfo[] = new Array();
        output.push(new TokenInfo("UTK", BigNumber.from("33")));
        return output;
    }
}