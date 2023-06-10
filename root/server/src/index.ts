import {default as express} from "express";
import { Server } from "socket.io"
import { ServerGameEngine } from "./game/server-game-engine";

const app = express()
const port = 3000

/**
 * TODO:
 * use the 'minimist' package to read input 
 * 
 * create flag: -train
 *  present -> ServerGameEngine will train agent(s)
 *  not present -> ServerGameEngine will act normally
 * 
 * Find a way to run as production / dev
 * package: cross-env
 * and then NODE_ENV=PRODUCTION / NODE_ENV=DEVELOPMENT
 */

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
    console.log(`Starting listening at http://localhost:${port}/`)
})

const io = new Server(httpServer, {
    path: '/game-socket',
    cors: {
        origin: '*'
    }
})

// host multiple lobbies for multiple different worlds
const lobby = new ServerGameEngine(60)

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)
    lobby.connectSocket(socket)

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`)
        lobby.disconnectSocket(socket)
    })
})




