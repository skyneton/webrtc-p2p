module.exports = (io) => {
    io.sockets.on("connection", (client) => {
        log("::Socket Connection:: " + client.handshake.address);

        socketEmitNotPlayer("PlayerConnection", client.id, client.id);

        client.on("disconnect", () => {
            log("::Socket Disconnect:: " + client.handshake.address);
            io.sockets.emit("PlayerDisconnection", client.id);
        })
        

        client.on("RTCConnection", () => {
            log("::RTCConnection::" + client.id);

            socketEmitNotPlayer("RTCConnection", client.id, client.id);
        });
    
        client.on("RTCConnection2", () => {
            for(const sockets in io.sockets.connected) {
                if(sockets != client.id) {
                    client.emit("RTCConnection", sockets);
                }
            }
        });

        client.on("RTCData", (data, to) => {
            if(to) {
                const x = io.sockets.connected[to];
                x.emit("RTCData", data, client.id);
            }
        });
    
        client.on("audioStatus", (data, to) => {
            if(to) {
                const x = io.sockets.connected[to];
                if(x) {
                    x.emit("audioStatus", { uid: client.id, status: data.status, streamId: data.streamId });
                }
            }else
                io.sockets.emit("audioStatus", { uid: client.id, status: data.status, streamId: data.streamId });
        });
    
        client.on("videoStatus", (data, to) => {
            if(to) {
                const x = io.sockets.connected[to];
                if(x) {
                    x.emit("videoStatus", { uid: client.id, status: data.status, streamId: data.streamId });
                }
            }else
                io.sockets.emit("videoStatus", { uid: client.id, status: data.status, streamId: data.streamId });
        });
    
        client.on("desktopStatus", (data, to) => {
            if(to) {
                const x = io.sockets.connected[to];
                if(x) {
                    x.emit("desktopStatus", { uid: client.id, status: data.status, streamId: data.streamId });
                }
            }else
                io.sockets.emit("desktopStatus", { uid: client.id, status: data.status, streamId: data.streamId });
        });
    });


    const socketEmitNotPlayer = (type, data, uid) => {
        for(const sockets in io.sockets.connected) {
            if(sockets != uid) {
                const player = io.sockets.connected[sockets];
                player.emit(type, data);
            }
        }
    }
}


const log = msg => {
	const logDate = new Date();
	const logD = "[" + logDate.getFullYear().toString().substring(2) + "/" + (logDate.getMonth() + 1).toString().padStart(2,'0') + " " + logDate.getHours().toString().padStart(2,'0') + ":" + logDate.getMinutes().toString().padStart(2,'0') + ":" + logDate.getSeconds().toString().padStart(2,'0') + "]";
	console.log(logD + " " + msg);
}