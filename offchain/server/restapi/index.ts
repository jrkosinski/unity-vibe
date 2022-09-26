import dotenv from 'dotenv';
import { startServer, ServerType } from './src/servers/startServer';
dotenv.config();

startServer(ServerType.Live, process.env.PORT).then((server) => {
    console.log(`server running at ${server.uri}`);
});