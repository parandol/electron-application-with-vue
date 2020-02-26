import events from "events";

import TCPSocketRouter from "./tcp-socket-router";

export default (() => {
    class TCPRouterManager extends events.EventEmitter {
        constructor() {
            super();
            this.routers = {};
        }
        
        execute(env, callback) {
            if(!TCPRouterManager.instance) return;
            env.forEach(({listen, port, host}) => {
                const key = listen + ":" + host + ":" + port;

                try {
                    const router = new TCPSocketRouter({listen, port, host});
    
                    router.on("transfered", (bytes) => {
                        this.emit("transfered", {key, bytes});
                    });
                    router.on("connected", (count) => {
                        this.emit("connected", {key, count});
                    });
                    router.on("closed", (count) => {
                        this.emit("closed", {key, count});
                    });
                    router.on("error", (error) => {
                        this.emit("error", {key, error});
                    })
                    router.on("log", (log) => {
                        // console.log("LOG : " + log);
                        this.emit("log", {key, date : new Date().getTime(), text: log});
                    })
    
                    router.startup();
                    this.routers[key] = router;
                } catch(err) {
                    console.log(err);
                }
            });

            callback(this.routers);
        };

        bytes() {
            let ret = {};
            for(const key in this.routers) {
                ret[key] = this.routers[key].bytes();
            }
            return ret;
        }

        count() {
            let ret = {};
            for(const key in this.routers) {
                ret[key] = this.routers[key].count();
            }
            return ret;
        }

        state() {
            let ret = {};
            for(const key in this.routers) {
                ret[key] = {
                    listen : this.routers[key].listen,
                    host : this.routers[key].host,
                    port : this.routers[key].port,
                    count : this.routers[key].count(),
                    bytes : this.routers[key].bytes()
                }
            }
            return ret;
        }

        details(key) {
            const router = this.routers[key];
            return router.details();
        }

        startup(env, callback) {
            this.execute(env, callback);
        }

        shutdown() {
            for(const key in this.routers) {
                this.routers[key].shutdown();
                delete this.routers[key];
            }
        }
    }
    
    return {
        getInstance() {
            if(!TCPRouterManager.instance) {
                TCPRouterManager.instance = new TCPRouterManager();
            }
            return TCPRouterManager.instance;
        }
    };
})();

// export default TCPRouterManager;
// module.exports = TCPRouterManager;

// https://nodejs.org/api/net.html
