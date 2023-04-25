import {Server} from "./server";

const PORT = 3000
const IP = '127.0.0.1'
const server = new Server(IP, PORT)

server.start()