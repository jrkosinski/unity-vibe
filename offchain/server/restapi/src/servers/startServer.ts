import express, { Express, Request, Response } from 'express';
import LiveServer from './LiveServer';
import MockServer from './MockServer';
import { IServer } from "./IServer";

export enum ServerType {
    Mock,
    Live
}

export function startServer(serverType : ServerType, port: any) : Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            const server: IServer = (serverType == ServerType.Mock) ? new MockServer() : new LiveServer;

            const app: Express = express();
            app.use(express.json());

            app.get('/', (req: Request, res: Response) => {
                res.send('Im an ad!');
            });
            
            const executeRequest = async (req: Request, res: Response, func : any) => {
                try {
                    await func();
                } catch (err) {
                    res.sendStatus(500);
                }
            }

            // getTokens(walletAddr)
            app.get('/tokens/:address', async (req: Request, res: Response) => {
                executeRequest(req, res, async () => {
                    const address: String = req.params.address;

                    //TODO: validation? 

                    res.send(JSON.stringify(await server.getTokens(address)));
                });
            });

            // awardTokens(walletAddr, tokenAddr, quantity)
            app.post('/tokens/:address', async (req: Request, res: Response) => {
                executeRequest(req, res, async () => {
                    const address: String = req.params.address;
                    const tokenAddr: String = req.body.tokenAddress;
                    let quantity: Number = 0;

                    if (req.body.quantity)
                        quantity = parseInt(req.body.quantity);

                    //validation 
                    if (
                        (!address || !address.length) ||
                        (!tokenAddr || !tokenAddr.length) ||
                        (!quantity || quantity < 0)
                    ) {

                        //TODO: send error msg as well 
                        res.sendStatus(400);
                    }
                    else {
                        res.send(JSON.stringify(await server.awardTokens(address, tokenAddr, quantity)));
                    }
                });
            });

            app.listen(port, () => {
                const uriBase = 'http://localhost'; 
                const uri: string = `${uriBase}:${port}`;
                
                resolve({
                    uriBase,
                    port,
                    uri
                });
            });
        }
        catch(err) {
            reject(err); 
        }
    });
}