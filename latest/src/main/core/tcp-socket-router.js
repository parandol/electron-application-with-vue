import TCPSocketServer from "./tcp-socket-server";
import TCPSocketClient from "./tcp-socket-client";

class TCPRouterClient extends TCPSocketClient {
    constructor({remote, port, host}) {
        super({port, host});
        this.remote = remote;
    }
    
    handleConnection(socket) {
        socket.setKeepAlive(true);
    };

    handleData(data) {
        this.remote.write(data);
        try {
            this.emit("log", "Client Socket Read : " + this.socket.bytesRead + ", Writtern : " + this.socket.bytesWritten);
            console.log("Client Read : %d, Writtern : %d ", this.socket.bytesRead, this.socket.bytesWritten);
            console.log("Remote Read : %d, Writtern : %d ", this.remote.bytesRead, this.remote.bytesWritten);
            this.emit("transfered");
        } catch(e){ }
    };

    handleClose() {
        console.log("Client to Server Socket Closed........ with Client " + this.remote.uuid);
        this.remote.end();
    }
}

class TCPSocketRouter extends TCPSocketServer {
    constructor({listen, host, port}) {
        super({listen});

        this.host = host;
        this.port = port;
        this.buffer = {};

        this.connections = {};
        this.counts = {};

        this.clientIndex = 0;
    }

    // starting point <---(client:Socket)---> router <---(server:TCPRouterClient)---> destination
    handleConnection(client) {
        console.log("=================================== TCPSocketRouter ===================================");
        //console.log('Client connection (Echo Server): ' + JSON.stringify(client));
        console.log('Client connection (Router Server)');
        this.emit("log", "Client connection " + client.remoteAddress + ":" + client.remotePort);

        // client.uuid = require("uuid/v4")();
        client.uuid = "client-" + (++this.clientIndex);
        // console.log('client.uuid : ' + client.uuid);

        this.connections[client.uuid] = {client};

        const server = new TCPRouterClient({type : this.type, remote: client, port: this.port, host : this.host, timeout : this.timeout});
        server.on("connect", () => {
            this.connections[client.uuid] = {client, server : server.socket};

            const clientSocket = client;
            const serverSocket = server.socket;

            // console.log('Buffer size : ' + serverSocket.bufferSize);

            clientSocket.setKeepAlive(true);
            serverSocket.setKeepAlive(true);

            // 접속 클라이언트 정보 추가
            const addr = clientSocket.remoteAddress;
            var count = this.counts[addr]
            if(!count || count == 0) {
                this.counts[addr] = 1;
            } else {
                this.counts[addr]++;
            }

            // 버퍼에 값이 있을 경우 값 전송
            var arr = this.buffer[client.uuid];
            if(arr) {
                let data = arr.shift();
                while(data) {
                    serverSocket.write(data);
                    data = arr.shift();
                }
            }
            
            console.log(
                "TCP Forwarding %s:%s <--> %s:%s START",
                clientSocket.remoteAddress, clientSocket.remotePort,
                serverSocket.remoteAddress, serverSocket.remotePort
            );
            
            this.emit("log", "TCP Forwarding " + clientSocket.remoteAddress + ":" + clientSocket.remotePort + " <--> " + serverSocket.remoteAddress + ":" + serverSocket.remotePort + " START");

            // console.log(
            //     "TCP Forwarding %s:%s(local) <--> (local) %s:%s START",
            //     clientSocket.localAddress, clientSocket.localPort,
            //     serverSocket.localAddress, serverSocket.localPort
            // );

            this.emit("connected", this.count());
            this.print();
        });
        server.on("transfered", () => {
            this.emit("transfered", this.bytes());
        });
        server.on("log", (log) => {
            this.emit("log", log);
        });
    }

    handleClose(client) {
        const uuid = client.uuid;
        const connection = this.connections[uuid];
        const clientSocket = connection.client;
        const serverSocket = connection.server;

        console.log(
            "TCP Forwarding %s:%s <--> %s:%s STOP",
            clientSocket.remoteAddress, clientSocket.remotePort,
            serverSocket.remoteAddress, serverSocket.remotePort
        );
        
        this.emit("log", "TCP Forwarding " + clientSocket.remoteAddress + ":" + clientSocket.remotePort + " <--> " + serverSocket.remoteAddress + ":" + serverSocket.remotePort + " STOP");

        // console.log(
        //     "TCP Forwarding %s:%s(local) <--> %s:%s(local) STOP",
        //     clientSocket.localAddress, clientSocket.localPort,
        //     serverSocket.localAddress, serverSocket.localPort
        // );

        // 접속 클라이언트 정보를 업데이트
        const addr = clientSocket.remoteAddress;
        var count = this.counts[addr]
        if(count <= 1) {
            delete this.counts[addr];
        } else {
            this.counts[addr]--;
        }

        this.connections[uuid] = null;
        delete this.connections[uuid];

        // 원격지 서버와의 접속 종료
        serverSocket.end();

        this.emit("closed", this.count());
        this.print();
    }

    handleData(client, data) {
        try {
            this.emit("log", "Server Socket Read : " + client.bytesRead + ", Writtern : " + client.bytesWritten);
            console.log("Server Socket Read : %d, Writtern : %d ", client.bytesRead, client.bytesWritten);
        } catch(e) {}

        const uuid = client.uuid;
        const connection = this.connections[uuid];
        if(connection && connection.server) {
            connection.server.write(data);
        } else {
            var arr = this.buffer[uuid];
            if(arr) {
                this.buffer[uuid].push(data);
            } else {
                this.buffer[uuid] = [];
                this.buffer[uuid].push(data);
            }
        }

        this.emit("transfered", this.bytes());
        // this.print();
    };

    print() {
        for(const key in this.counts) {
            // this.emit("log", "Client [" + key + "] : " + this.counts[key]);
            console.log("Client [%s] : %d", key, this.counts[key]);
        }
        for(const key in this.connections) {
            const connection = this.connections[key];
            if(connection) {
                // console.log("Client [%s], Sent : %d, Received : %d ", key, connection.sendBytes, connection.receiveBytes);
                if(connection.server && connection.server) {
                    try {
                        // this.emit("log", "Client [" + key + "], Sent : " + connection.client.bytesRead + ", Received : "+ connection.server.bytesRead);
                        console.log("Client [%s], Sent : %d, Received : %d ", key, connection.client.bytesRead, connection.server.bytesRead);
                    } catch(e) {}
                // } else {
                //   console.log("Client [%s], Received : %d, Sent : 0 ", key, connection.client.bytesWritten);
                }
            }
        }
    }

    count() {
        let count = 0;
        for(const key in this.counts) {
            count += this.counts[key];
        }
        return count;
    }

    bytes() {
        let serverReadBytes = 0;
        let serverWriteBytes = 0;
        let clientReadBytes = 0;
        let clientWriteBytes = 0;
        
        for(const key in this.connections) {
            try {
                const conn = this.connections[key];
                serverReadBytes += conn.server.bytesRead || 0,
                serverWriteBytes += conn.server.bytesWritten || 0,
                clientReadBytes += conn.client.bytesRead || 0,
                clientWriteBytes += conn.client.bytesWritten || 0
            } catch(e) { }
        }

        return {
            serverReadBytes,
            serverWriteBytes,
            clientReadBytes,
            clientWriteBytes
        };
    }

    details() {
        let ret = [];
        for(const key in this.connections) {
            const conn = this.connections[key];
            try {
                ret.push({
                    address : conn.client.remoteAddress,
                    port : conn.client.remotePort,
                    serverReadBytes : conn.server.bytesRead || 0,
                    serverWriteBytes : conn.server.bytesWritten || 0,
                    clientReadBytes : conn.client.bytesRead || 0,
                    clientWriteBytes : conn.client.bytesWritten || 0
                });
            } catch(e) {}
        }
        return ret;
    }

    // shutdown() {
    //     for(const key in this.connections) {
    //         const conn = this.connections[key];
    //         conn.close();
    //     }
    //     this.shutdown();
    // }
}

export default TCPSocketRouter;
// module.exports = TCPSocketRouter;


// const env = 
// [
//         {
//                 listen : 9010,
//                 host : "localhost",
//                 port : 9090
//         },
//         {
//                 listen : 9020,
//                 host : "192.168.0.5",
//                 port : 9090
//         }
// ]

// new TCPSocketRouter ({
//     listen : 9010,
//     host : "localhost",
//     port : 9090
// });


// new TCPSocketRouter ({
//     listen : 9020,
//     host : "192.168.0.100",
//     port : 9090
// });

// https://nodejs.org/api/net.html