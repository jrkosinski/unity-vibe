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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class MockServer {
    getTokens(address) {
        return __awaiter(this, void 0, void 0, function* () {
            let output = new Array();
            output.push(new server_1.TokenInfo("UTK", ethers_1.BigNumber.from("33")));
            return output;
        });
    }
    awardTokens(address, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            let output = new Array();
            output.push(new server_1.TokenInfo("UTK", ethers_1.BigNumber.from("33")));
            return output;
        });
    }
}
exports.default = MockServer;
