const axios = require('axios').default;
const { expect } = require('chai');
const { Server } = require('http');
const { ServerType, startServer } = require('../src/servers/startServer');

describe('REST API Tests: Live Server', () => {
    let server = null;
    let testCount = 0;

    beforeEach(async () => {
        if (server == null)
            server = await startServer(ServerType.Live, 3001);
    });

    describe('GET /tokens', () => {
        it('GET /tokens with no address', async () => {
            let statusCode = 0;
            try {
                await axios.get(server.uri + '/tokens/');
            } catch (err) {
                statusCode = err.response.status;
            }
            expect(statusCode).to.equal(404);
        });

        it('GET /tokens with invalid address', async () => {
            let statusCode = 0;
            try {
                const response = await axios.get(server.uri + '/tokens/92380ufklslfksl');
                statusCode = response.status;

                expect(response.data.length).to.equal(0);
            } catch (err) {
                statusCode = err.response.status;
            }
            expect(statusCode).to.equal(200);
        });

        it('GET /tokens with valid address', async () => {
            let statusCode = 0;
            try {
                const response = await axios.get(server.uri + '/tokens/0xcEa845CA58C8dD4369810c3b5168C49Faa34E6F3');
                statusCode = response.status;

                expect(response.data.length).to.equal(1);
                expect(response.data[0].symbol).to.equal("UTK");
                expect(response.data[0].quantity.hex).to.equal("0x21");
            } catch (err) {
                statusCode = err.response.status;
            }
            expect(statusCode).to.equal(200);
        });
    });

    afterEach(() => {
        testCount++;

        //TODO: find a way 
        //process.exit();
    });
});