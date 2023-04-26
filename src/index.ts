import {RedisTSServer} from "./server";

const PORT = 6379 // the REDIS port
const IP = '127.0.0.1' // aka localhost
const server = new RedisTSServer(IP, PORT)

server.start()