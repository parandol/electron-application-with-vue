import events from "events";

import TCPSocketRouter from "./tcp-socket-router";

export default (() => {
    class TCPRouterManager extends events.EventEmitter {
        constructor() {
            super();
            this.routers = {};
        }
        
        execute(env) {
            if(!TCPRouterManager.instance) return;

            env.forEach(({listen, port, host}) => {
                const key = host + ":" + port;

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
    
                    router.startup();
                    this.routers[key] = router;
                } catch(err) {
                    console.log(err);
                }
            });
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
                    count : this.routers[key].count(),
                    bytes : this.routers[key].bytes()
                }
            }
            return ret;
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

export default TCPRouterManager;
// module.exports = TCPRouterManager;

// https://nodejs.org/api/net.html
