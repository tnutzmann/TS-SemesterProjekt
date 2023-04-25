import {RedisTSServer} from "./server";

const PORT = 3000
const IP = '127.0.0.1'
const server = new RedisTSServer(IP, PORT)

server.start()