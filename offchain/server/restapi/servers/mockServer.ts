import { Server, TokenInfo } from "./server";
import { BigNumber } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

export default class MockServer implements Server {
    async getTokens(address: String): Promise<TokenInfo[]> {
        let output: TokenInfo[] = new Array();
        output.push(new TokenInfo("UTK", BigNumber.from("33")));
        return output;
    }

    async awardTokens(address: String, quantity: Number): Promise<TokenInfo[]>  {
        let output: TokenInfo[] = new Array();
        output.push(new TokenInfo("UTK", BigNumber.from("33")));
        return output;
    }
}