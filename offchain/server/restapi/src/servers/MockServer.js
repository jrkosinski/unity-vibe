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
const IServer_1 = require("./IServer");
const ethers_1 = require("ethers");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class MockServer {
    constructor() {
        this.validAddress = "0xcEa845CA58C8dD4369810c3b5168C49Faa34E6F3";
    }
    getTokens(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (address.toLowerCase() == this.validAddress.toLowerCase()) {
                let output = new Array();
                output.push(new IServer_1.TokenInfo("UTK", ethers_1.BigNumber.from("33")));
                return output;
            }
            else {
                return [];
            }
        });
    }
    awardTokens(address, tokenAddress, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            let output = new Array();
            output.push(new IServer_1.TokenInfo("UTK", ethers_1.BigNumber.from("33")));
            return output;
        });
    }
}
exports.default = MockServer;
