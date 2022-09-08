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
const express_1 = __importDefault(require("express"));
const liveServer_1 = __importDefault(require("./servers/liveServer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const server = new liveServer_1.default();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Im an ad!');
});
// getTokens(walletAddr)
app.get('/tokens/:address', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const address = req.params.address;
    console.log(`token request for ${address}`);
    res.send(JSON.stringify(yield server.getTokens(address)));
}));
// awardTokens(walletAddr, tokenAddr, quantity)
app.post('/tokens/:address', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const address = req.params.address;
    const quantity = parseInt(req.body.quantity);
    console.log(`award ${quantity} tokens to ${address}`);
    res.send(JSON.stringify(yield server.awardTokens(address, quantity)));
}));
app.listen(process.env.PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${process.env.PORT}`);
});
