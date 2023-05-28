import {default as express} from "express";
import { Server } from "socket.io"
import GameEngine from "./game_engine";

const app = express()
const port = 3000

// // Temporary cors middleware
// // from https://stackoverflow.com/questions/55522717/how-to-enable-cors-in-nodejs
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     next();
// })

// Setup static file serving
app.use(express.static("../client/dist"))

// Setup port + listen
const httpServer = app.listen(3000, () => {
    console.log(`Starting listening at http://localhost:${port}/`)
})

// Setup socket.io
const io = new Server(httpServer, {
    path: '/mysocket'
    // cors: {
    //     origin: '*'
    // }
})

// Setup the game engine with socket connection handling
const gameEngine = new GameEngine()

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`)
    gameEngine.onSocketConnect(socket)

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`)
        gameEngine.onSocketDisconnect(socket)
    })
})


