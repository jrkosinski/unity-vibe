import express, { Express, Request, Response } from 'express';
import LiveServer from './servers/liveServer';
import MockServer from './servers/mockServer';
import dotenv from 'dotenv';
dotenv.config();

const server = new LiveServer();
const app: Express = express();
app.use(express.json()); 

app.get('/', (req: Request, res: Response) => {
    res.send('Im an ad!');
});

// getTokens(walletAddr)
app.get('/tokens/:address', async (req: Request, res: Response) => {
    const address: String = req.params.address;
    console.log(`token request for ${address}`);
    
    res.send(JSON.stringify(await server.getTokens(address))); 
}); 

// awardTokens(walletAddr, tokenAddr, quantity)
app.post('/tokens/:address', async (req: Request, res: Response) => {
    const address: String = req.params.address;
    const quantity: Number = parseInt(req.body.quantity); 
    console.log(`award ${quantity} tokens to ${address}`);

    res.send(JSON.stringify(await server.awardTokens(address, quantity)));
});


app.listen(process.env.PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${process.env.PORT}`);
});