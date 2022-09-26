import { IServer, TokenInfo } from "./IServer";
import { ethers, BigNumber } from 'ethers';
const unityTokenAbi = require("../contracts/UnityTokenABI");
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.providers.AlchemyProvider(
    process.env.ETH_NETWORK,
    process.env.ALCHEMY_KEY
);

export default class LiveServer implements IServer {
    tokenContract: ethers.Contract;
    adminWallet: ethers.Wallet;
    
    constructor() {
        this.tokenContract = new ethers.Contract(
            process.env.ERC20_ADDRESS ?? "", 
            unityTokenAbi, 
            provider
        );
        
        this.adminWallet = new ethers.Wallet(
            process.env.ADMIN_WALLET_PRIVKEY ?? "", 
            provider
        );
    }
    
    async getTokenInfo(tokenAddress: String, address: String): Promise<TokenInfo> {
        const symbol: String = "UTK"; //await this.tokenContract.symbol();
        const balance: BigNumber = await this.tokenContract.balanceOf(address);
        return new TokenInfo(symbol, balance); 
    }

    async getTokens(address: String): Promise<TokenInfo[]> {
        let output: TokenInfo[] = new Array(); 
        
        output.push(await this.getTokenInfo(process.env.ERC20_ADDRESS ?? "", address)); 
        return output; 
    }

    async awardTokens(address: String, tokenAddress: String, quantity: Number): Promise<TokenInfo[]> {
        let output: TokenInfo[] = new Array();

        await this.tokenContract.connect(this.adminWallet).mint(address, quantity); 
        
        output.push(await this.getTokenInfo(process.env.ERC20_ADDRESS ?? "", address)); 
        return output; 
    }
}