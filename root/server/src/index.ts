import {default as express} from "express";
import minimist from "minimist";
import { Server } from "socket.io"
import { ServerGameEngine } from "./game/server-game-engine";

// parse arguments
const argv = minimist(process.argv.slice(2), {
  string: ["train"],
});

const train = argv.train !== undefined;

// start application
const app = express()
const port = 3000

// Temporary cors middleware (for development)
app.use((req, res, next) => {

    // TODO: Log IP and other information
    req.ip

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
})

app.use(express.static("../client/dist"))

const httpServer = app.listen(3000, () => {
  console.log(`Starting listening at http://localhost:${port}/`);
});

const io = new Server(httpServer, {
    path: '/game-socket',
    cors: {
        origin: '*'
    }
})

// host multiple lobbies for multiple different worlds
const lobby = new ServerGameEngine(train ? 1000 : 60, train)

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)
    lobby.connectSocket(socket)

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`)
        lobby.disconnectSocket(socket)
    })
})




