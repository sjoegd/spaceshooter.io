import {default as express} from "express";
import { Server } from "socket.io"
import { GameEngine } from "./game/game_engine";

const app = express()
const port = 3000

// Temporary cors middleware
// from https://stackoverflow.com/questions/55522717/how-to-enable-cors-in-nodejs
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
})

// Setup static file serving
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

const lobby = new GameEngine()

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    lobby.onSocketConnect(socket)
    socket.on('disconnect', () => {
        lobby.onSocketDisconnect(socket)
    })
})




