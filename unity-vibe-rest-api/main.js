const express = require("express")
const bodyParser = require('body-parser');
const api = require("./lib/api");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;


app.get('/', (req, res) => {
});

app.get('/tokens/:address', async (req, res) => {
    const address = req.params.address;
    console.log(`token request for ${address}`);

    const balance = await api.getBalance(address);
    res.send(balance.toString());
}); 

app.post('/tokens/:address', async (req, res) => {
    const address = req.params.address;
    console.log('Got body:', req.body);
    const amount = parseInt(req.body.amount);
    console.log(`request to award ${amount} tokens to ${address}`); 
    
    await api.awardTokens(address, amount);
    const balance = await api.getBalance(address);
    res.send(balance.toString());
});

app.listen(port, () => {
    console.log(`API listening on port ${port}`)
})