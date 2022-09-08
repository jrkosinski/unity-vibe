"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const ethers_1 = require("ethers");
const unityTokenAbi = require("../contracts/UnityTokenABI");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const provider = new ethers_1.ethers.providers.AlchemyProvider(process.env.ETH_NETWORK, process.env.ALCHEMY_KEY);
class LiveServer {
    constructor() {
        var _a, _b;
        this.tokenContract = new ethers_1.ethers.Contract((_a = process.env.ERC20_ADDRESS) !== null && _a !== void 0 ? _a : "", unityTokenAbi, provider);
        this.adminWallet = new ethers_1.ethers.Wallet((_b = process.env.ADMIN_WALLET_PRIVKEY) !== null && _b !== void 0 ? _b : "", provider);
    }
    getTokenInfo(tokenAddress, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const symbol = "UTK"; //await this.tokenContract.symbol();
            const balance = yield this.tokenContract.balanceOf(address);
            return new server_1.TokenInfo(symbol, balance);
        });
    }
    getTokens(address) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let output = new Array();
            output.push(yield this.getTokenInfo((_a = process.env.ERC20_ADDRESS) !== null && _a !== void 0 ? _a : "", address));
            return output;
        });
    }
    awardTokens(address, quantity) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let output = new Array();
            yield this.tokenContract.connect(this.adminWallet).mint(address, quantity);
            output.push(yield this.getTokenInfo((_a = process.env.ERC20_ADDRESS) !== null && _a !== void 0 ? _a : "", address));
            return output;
        });
    }
}
exports.default = LiveServer;
