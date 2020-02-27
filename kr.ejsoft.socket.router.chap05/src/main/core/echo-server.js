//import TCPSocketServer from "./tcp-socket-server";

const TCPSocketServer = require('./tcp-socket-server'); 

class EchoServer extends TCPSocketServer {
    constructor(port) {
        super({port});
    }

    handleConnection(client) {
        //console.log('Client connection (Echo Server): ' + JSON.stringify(client));
        console.log('Client connection (Echo Server)');
        const clients = this.server.getConnections((err, count) => {
            console.log("Clients count : " + count);
        });
        // console.log("Clients : " + JSON.stringify(clients));
    }

    handleData(client, data) { 
        this.write(client, data);
        console.log('Received data(' + client.bytesWritten + ' bytes) from client on port %d: %s', client.remotePort, data.toString());
    };

    handleClose(client) {
        console.log('Client disconnected');
    }
}

new EchoServer({ port : 9090 });
