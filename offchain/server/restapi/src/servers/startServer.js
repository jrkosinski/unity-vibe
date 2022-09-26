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
exports.startServer = exports.ServerType = void 0;
const express_1 = __importDefault(require("express"));
const LiveServer_1 = __importDefault(require("./LiveServer"));
const MockServer_1 = __importDefault(require("./MockServer"));
var ServerType;
(function (ServerType) {
    ServerType[ServerType["Mock"] = 0] = "Mock";
    ServerType[ServerType["Live"] = 1] = "Live";
})(ServerType = exports.ServerType || (exports.ServerType = {}));
function startServer(serverType, port) {
    return new Promise((resolve, reject) => {
        try {
            const server = (serverType == ServerType.Mock) ? new MockServer_1.default() : new LiveServer_1.default;
            const app = (0, express_1.default)();
            app.use(express_1.default.json());
            app.get('/', (req, res) => {
                res.send('Im an ad!');
            });
            const executeRequest = (req, res, func) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield func();
                }
                catch (err) {
                    res.sendStatus(500);
                }
            });
            // getTokens(walletAddr)
            app.get('/tokens/:address', (req, res) => __awaiter(this, void 0, void 0, function* () {
                executeRequest(req, res, () => __awaiter(this, void 0, void 0, function* () {
                    const address = req.params.address;
                    //TODO: validation? 
                    res.send(JSON.stringify(yield server.getTokens(address)));
                }));
            }));
            // awardTokens(walletAddr, tokenAddr, quantity)
            app.post('/tokens/:address', (req, res) => __awaiter(this, void 0, void 0, function* () {
                executeRequest(req, res, () => __awaiter(this, void 0, void 0, function* () {
                    const address = req.params.address;
                    const tokenAddr = req.body.tokenAddress;
                    let quantity = 0;
                    if (req.body.quantity)
                        quantity = parseInt(req.body.quantity);
                    //validation 
                    if ((!address || !address.length) ||
                        (!tokenAddr || !tokenAddr.length) ||
                        (!quantity || quantity < 0)) {
                        //TODO: send error msg as well 
                        res.sendStatus(400);
                    }
                    else {
                        res.send(JSON.stringify(yield server.awardTokens(address, tokenAddr, quantity)));
                    }
                }));
            }));
            app.listen(port, () => {
                const uriBase = 'http://localhost';
                const uri = `${uriBase}:${port}`;
                resolve({
                    uriBase,
                    port,
                    uri
                });
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.startServer = startServer;
