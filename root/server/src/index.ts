import {default as express} from "express";
import minimist from "minimist";
import winston from "winston";
import { Server } from "socket.io"
import { ServerGameEngine } from "./game/server-game-engine";
import path from "path";

// Parse arguments
const argv = minimist(process.argv.slice(2), {
  string: ["train"],
}); 
const train = argv.train !== undefined;

// Setup express
const app  = express();
const port = 3000;

// Setup logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: path.resolve(__dirname, "../logs/info.log") }),
  ]
});

// Logging middleware
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;
  logger.info(`${new Date().getDate()} | ${req.method} | ${req.path} | ${ip}`);
  next();
});

// Cors middleware
app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin", 
        "http://localhost:3000/"
    );
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With, content-type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Credentials",
        "true"
    );

    next();
});

// Static middleware
app.use(express.static("../client/dist"));

// Setup server
const server = app.listen(port, () => {
    logger.info(`Starting listening at http://localhost:${port}/`);
});

// Setup socket.io
const io = new Server(server, {
    path: '/game-socket',
    cors: {
        origin: '*'
    }
})

// Setup a game lobby
const lobby = new ServerGameEngine(train ? 1000 : 60, train)

// Setup socket connections to lobby
io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`)
    lobby.connectSocket(socket)

    socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`)
        lobby.disconnectSocket(socket)
    })
})




