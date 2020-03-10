//import TCPSocketClient from "tcp-socket-client";

const TCPSocketClient = require('./tcp-socket-client'); 

class EchoClient extends TCPSocketClient {
    constructor({port, host, timeout}) {
        super({port, host, timeout});
    }
    
    handleConnection(socket) {
        console.log("connect log======================================================================"); 
        console.log('connect success'); 
        console.log('local = ' + socket.localAddress + ':' + socket.localPort); 
        console.log('remote = ' + socket.remoteAddress + ':' + socket.remotePort); 

        socket.setEncoding('utf8'); 
        socket.setTimeout(this.timeout || 10000); // timeout : 10분 
        console.log("Client setting Encoding:binary, timeout:" + (this.timeout || 10000));
        console.log("Client connect localport : " + socket.localPort);
    };
    
    handleData(data) { 
        console.log("data recv log======================================================================"); 
        console.log("data : " + data);
        console.log("data.length : " + data.length);
        console.log("data recv : " + data);
    };

    handleClose() {
    }
}

var client1 = new EchoClient({port: 9010, host:'192.168.0.100'});
client1.on("connect", () => {
    client1.write("Echo Message1 in Client1....");
    setTimeout(() => {
        client1.write("Echo Message2 in Client1....");
    }, 1500);
    setTimeout(() => {
        client1.close();
        console.log("-------------");
    }, 3000);
});


var client2 = new EchoClient({port: 9010, host:'localhost'});
client2.on("connect", () => {
    client2.write("Echo Message1 in Client2....");
    setTimeout(() => {
        client2.write("Echo Message2 in Client2....");
    }, 2000);
    setTimeout(() => {
        client2.close();
        console.log("-------------");
    }, 5000);
});

var client3 = new EchoClient({port: 9010, host:'192.168.0.100'});
client3.on("connect", () => {
    client3.write("Echo Message1 in Client1....");
    setTimeout(() => {
        client3.write("Echo Message2 in Client1....");
    }, 1000);
    setTimeout(() => {
        client3.close();
        console.log("-------------");
    }, 3500);
});


var client4 = new EchoClient({port: 9010, host:'localhost'});
client4.on("connect", () => {
    client4.write("Echo Message1 in Client2....");
    setTimeout(() => {
        client4.write("Echo Message2 in Client2....");
    }, 2000);
    setTimeout(() => {
        client4.close();
        console.log("-------------");
    }, 4000);
});


// var client2 = new EchoClient({port: 9020, host:'localhost'});
// client2.on("connect", () => {
//     client2.write("Echo Message in Client2....");
//     setTimeout(() => {
//         client2.close();
//         console.log("-------------");
//     }, 5000);
// });


