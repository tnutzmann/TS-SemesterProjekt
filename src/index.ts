import * as net from 'net'
import * as wp from 'workerpool'

const PORT = 3000
const IP = '127.0.0.1'
const BACKLOG = 100

const workerpool = wp.pool()

console.log('Server start')

net.createServer().listen(PORT, IP, BACKLOG)
    .on('connection', socket => {
        console.log(`new connection from ${socket.remoteAddress}:${socket.remotePort}`)
        socket.on('data', data => {
            console.log(`sended data: ${data.toString()}`)

            workerpool.exec((str: string)=> {
                return str
            }, [data.toString()])
                .then(res => {
                socket.write(res + '\n')
                socket.end()
            })
        })
    })