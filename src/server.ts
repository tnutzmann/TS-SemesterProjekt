import * as net from 'net'
import * as wp from 'workerpool'

export class Server {
    private readonly port: number
    private readonly ip: string
    private readonly workerPool = wp.pool()

    constructor(ip: string, port: number) {
        this.port = port
        this.ip = ip
    }

    public start() {
        console.log(`Server start at ${this.ip}:${this.port}`)

        // start to listen at PORT
        net.createServer().listen(this.port, this.ip)
            // on new incoming connection
            .on('connection', socket => {
                // log connection information from remote host
                console.log(`new connection from ${socket.remoteAddress}:${socket.remotePort}`)
                // on incoming request
                socket.on('data', request => {
                    console.log(`incoming data: ${request.toString()}`)
                    // create new worker to handle request
                    this.workerPool.exec((request_str: string)=> {
                        return request_str
                    }, [request.toString()])

                        .then(reply => {
                            socket.write(reply + '\n')

                            socket.end()
                        })
                })
            })
    }
}
