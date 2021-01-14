const session = require("./session");
module.exports = (io) => {
    io.sockets.on("connection", (client) => {
        log("::Socket Connection:: " + client.handshake.address);

        socketEmitNotPlayer("PlayerConnection", client.id, client.id);
        client.emit("JoinRoom", client.id);

        client.on("disconnect", () => {
            log("::Socket Disconnect:: " + client.handshake.address);
            io.sockets.emit("PlayerDisconnection", client.id);

            if(client.key) {
                session.used.splice(session.used.indexOf(client.key), 1);
                delete session.data[client.key];
            }
        });
        
        client.on("session", key => {
            if(session.used.includes(key)) {
                client.emit("serverError", 1);
                client.disconnect();
                return;
            }if(!session.data[key]) {
                client.emit("serverError", 2);
                client.disconnect();
                return;
            }//if(!session.data[key].uid) {
            //     client.emit("serverError", 3);
            //     client.disconnect();
            //     return;
            // }
            // for(const skey in session.data) {
            //     if(skey == key) continue;
            //     if(session.data[skey] == session.data[key]) {
            //         client.emit("serverError", 4);
            //         client.disconnect();
            //         return;
            //     }
            // }

            client.key = key;
            session.used.push(key);
        });

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
				if(x)
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

        client.on("chat", msg => {
            if(msg.replace(/ /, "").replace(/\n/, "").length == 0) return;
            msg = splitTags(msg);
            msg = msg.trim().replace(/\n/gi, "<br>").replace(/　/gi, "");
            const day = new Date();
            const packet = { "sender": client.id, "msg": msg, "time": `${day.getHours()}H ${day.getMinutes()}M` };
            io.sockets.emit("chat", JSON.stringify(packet));
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

const splitTags = (data) => {
    return data.replace(/&/gi, "&#38;")
        .replace(/#/gi, "&#35;")
        .replace(/&&#35;38;/gi, "&#38;")
        .replace(/</gi, "&lt;")
        .replace(/>/gi, "&gt;")
        .replace(/\(/gi, "&#40;")
        .replace(/\)/gi, "&#41;")
        .replace(/ /gi, "&nbsp;")
        .replace(/=/gi, "&#61;")
        .replace(/'/gi, "&#39;")
        .replace(/"/gi, "&quot;");
};


const splitTagsReverse = (data) => {
    return data.replace("&#38;", "&")
        .replace(/&#35;/gi, "#")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&#40;/gi, "(")
        .replace(/&#41;/gi, ")")
        .replace(/&nbsp;/gi, " ")
        .replace(/&#61;/gi, "=")
        .replace(/&#39;/gi, "'")
        .replace(/&#34;/gi, '"');
};