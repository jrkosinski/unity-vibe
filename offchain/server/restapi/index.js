"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const startServer_1 = require("./src/servers/startServer");
dotenv_1.default.config();
(0, startServer_1.startServer)(startServer_1.ServerType.Live, process.env.PORT).then((server) => {
    console.log(`server running at ${server.uri}`);
});
