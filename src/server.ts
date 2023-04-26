import {Socket, createServer} from 'net'

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
            let request_str = request.toString()
            console.log(`incoming data from ${socket.remoteAddress}:${socket.remotePort}: ${request_str}`)
            // create new worker to handle request
            if(request_str.match("QUIT")) {
                socket.end()
                console.log(`Terminated connection to ${socket.remoteAddress}:${socket.remotePort}`)
                return
            }
            // reply with the same message
            //socket.write(request_str)
        })
    }
}
