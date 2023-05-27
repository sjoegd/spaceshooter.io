"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const game_engine_1 = __importDefault(require("./game_engine"));
const app = (0, express_1.default)();
const port = 3000;
// Temporary cors middleware
// from https://stackoverflow.com/questions/55522717/how-to-enable-cors-in-nodejs
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
// Setup static file serving
app.use(express_1.default.static("../client/dist"));
// Setup port + listen
const httpServer = app.listen(3000, () => {
    console.log(`Starting listening at http://localhost:${port}/`);
});
// Setup socket.io
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*'
    }
});
// Setup the game engine with socket connection handling
const gameEngine = new game_engine_1.default();
io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    gameEngine.onSocketConnect(socket);
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
        gameEngine.onSocketDisconnect(socket);
    });
});
