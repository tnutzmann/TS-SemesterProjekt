import {Socket, createServer} from 'net'
import {RESP_Data} from "./basics";
import {decodeRESP} from "./resp_decoder";

export class RedisTSServer {
    private readonly port: number
    private readonly ip: string

    constructor(ip: string, port: number) {
        this.port = port
        this.ip = ip
    }

    public start() {
        console.log(`Server start at ${this.ip}:${this.port}`)
        // start to listen at PORT
        createServer().listen(this.port, this.ip)
            // on new incoming connection
            .on('connection', (socket: Socket) => {
                this.handleConnection(socket)
            })
    }

    private handleConnection(socket: Socket) {
        // log connection information from remote host
        console.log(`new connection from ${socket.remoteAddress}:${socket.remotePort}`)
        // on incoming request
        socket.on('data', request => {
            const decoded_data: RESP_Data = decodeRESP(request)
            console.log(`incoming data from ${socket.remoteAddress}:${socket.remotePort}: ${String(decoded_data)}`)

            // reply with the same message
            // socket.write("Sent data: " + String(decoded_data))
            socket.write("+OK\r\n") // reply with a simple OK
        })
        socket.on("close", () => {
            // gracefully close the connection
            socket.end()
            console.log(`Terminated connection to ${socket.remoteAddress}:${socket.remotePort}`)
            return
        })
    }
}
