const session = require("./session");
const crypto = require("crypto");
module.exports = (io) => {
    io.sockets.on("connection", (client) => {
        // log("::Socket Connection:: " + client.handshake.address);

        client.on("disconnect", () => {
            // log("::Socket Disconnect:: " + client.handshake.address);
            if(client.room) {
                sendPacketInRoom(client.room, "PlayerDisconnection", client.id);
                if(io.sockets.adapter.rooms[client.room]) client.leave(client.room);

                if(io.sockets.adapter.rooms[client.room] && io.sockets.adapter.rooms[client.room].allow && io.sockets.adapter.rooms[client.room].allow.includes(session.data[client.key].uid))
                    io.sockets.adapter.rooms[client.room].allow.splice(io.sockets.adapter.rooms[client.room].allow.indexOf(session.data[client.key].uid), 1);
                if(io.sockets.adapter.rooms[client.room] && io.sockets.adapter.rooms[client.room].sockets.length <= 0)
                    delete io.sockets.adapter.rooms[client.room]
            }

            if(client.key) {
                session.used.splice(session.used.indexOf(client.key), 1);
                delete session.data[client.key];
            }
        });

        client.on("callClose", () => {
            if(client.room && io.sockets.adapter.rooms[client.room] && session.data[client.key] && client.room == session.data[client.key].uid) {
                for(const sockets in io.sockets.adapter.rooms[client.room].sockets) {
                    if(sockets != client.id) {
                        const player = io.sockets.connected[sockets];
                        if(player) {
                            player.emit("callClose");
                            player.disconnect();
                        }
                    }
                }
            }
            if(session.data[client.key] && io.sockets.adapter.rooms[client.room] && io.sockets.adapter.rooms[client.room].allow && io.sockets.adapter.rooms[client.room].allow.includes(session.data[client.key].uid))
                io.sockets.adapter.rooms[client.room].allow.splice(io.sockets.adapter.rooms[client.room].allow.indexOf(session.data[client.key].uid), 1);
            client.emit("callClose");
            client.disconnect();
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
            }/*if(session.data[key].uid == null || session.data[key].uid == undefined) {
                client.emit("serverError", 3);
                client.disconnect();
                return;
            }
            for(const skey in session.data) {
                if(skey == key) continue;
                if(session.data[skey].uid == session.data[key].uid) {
                    if(!session.data[skey].socket || io.sockets.connected[session.data[skey.socket]]) {
                        delete session.data[skey];
                        continue;
                    }
                    client.emit("serverError", 4);
                    client.disconnect();
                    return;
                }
            }*/

            client.key = key;
            if(client.room) {
                sendPacketInRoom(client.room, "PlayerDisconnection", client.id);
                if(io.sockets.adapter.rooms[client.room]) client.leave(client.room);
            }

            client.room = undefined;
            if(session.data[client.key].room) {
                if(io.sockets.adapter.rooms[session.data[client.key].room]) {
                    client.room = session.data[client.key].room;
                }else
                    client.emit("serverMsg", {"type": 1, "message": "삭제되었거나 존재하지 않는 방입니다." });
            }

            if(!client.room)
                client.room = session.data[key].uid;

            client.join(client.room);
            session.used.push(key);

            socketEmitNotPlayer(client.room, client.id, "PlayerConnection", client.id, session.data[client.key].name);
            client.emit("JoinRoom", client.id, session.data[client.key].name);
            session.data[client.key].socket = client.id;
        });

        client.on("createToken", () => {
            if(!client.room || !io.sockets.adapter.rooms[client.room]) return;
            if(session.data[client.key] && client.room == session.data[client.key].uid) {
                io.sockets.adapter.rooms[client.room].token = createRandomToken();
                client.emit("createToken", `${client.room}/${io.sockets.adapter.rooms[client.room].token}`);
            }
        });

        client.on("RTCConnection", () => {
            // log("::RTCConnection::" + client.id);

            socketEmitNotPlayer(client.room, client.id, "RTCConnection", client.id, session.data[client.key].name);
        });
    
        client.on("RTCConnection2", () => {
            if(!client.room || !io.sockets.adapter.rooms[client.room]) return;
            for(const sockets in io.sockets.adapter.rooms[client.room].sockets) {
                if(sockets != client.id) {
                    client.emit("RTCConnection", sockets);
                }
            }
        });

        client.on("RTCData", (data, to) => {
            if(to && client.room && io.sockets.adapter.rooms[client.room]) {
                const x = io.sockets.connected[to];
				if(x && x.room == client.room)
					x.emit("RTCData", data, client.id, session.data[client.key].name);
            }
        });
    
        client.on("audioStatus", (data, to) => {
            if(!client.room || !io.sockets.adapter.rooms[client.room]) return;
            if(to) {
                const x = io.sockets.connected[to];
                if(x && x.room == client.room) {
                    x.emit("audioStatus", { uid: client.id, status: data.status, streamId: data.streamId });
                }
            }else
                io.sockets.in(client.room).emit("audioStatus", { uid: client.id, status: data.status, streamId: data.streamId });
        });
    
        client.on("videoStatus", (data, to) => {
            if(!client.room || !io.sockets.adapter.rooms[client.room]) return;
            if(to) {
                const x = io.sockets.connected[to];
                if(x && x.room == client.room) {
                    x.emit("videoStatus", { uid: client.id, status: data.status, streamId: data.streamId });
                }
            }else
                io.sockets.in(client.room).emit("videoStatus", { uid: client.id, status: data.status, streamId: data.streamId });
        });
    
        client.on("desktopStatus", (data, to) => {
            if(!client.room || !io.sockets.adapter.rooms[client.room]) return;
            if(to) {
                const x = io.sockets.connected[to];
                if(x && x.room == client.room) {
                    x.emit("desktopStatus", { uid: client.id, status: data.status, streamId: data.streamId });
                }
            }else
                io.sockets.in(client.room).emit("desktopStatus", { uid: client.id, status: data.status, streamId: data.streamId });
        });

        client.on("chat", msg => {
            if(!client.room || !io.sockets.adapter.rooms[client.room]) return;
            if(msg.replace(/ /, "").replace(/\n/, "").length == 0) return;
            msg = splitTags(msg.trim());
            msg = msg.replace(/\n/gi, "<br>").replace(/　/gi, "");
            const day = new Date();
            const packet = { "sender": client.id, "msg": msg, "time": `${day.getHours()}H ${day.getMinutes()}M`, "name": session.data[client.key].name };
            io.sockets.in(client.room).emit("chat", JSON.stringify(packet));
        });
    });


    const socketEmitNotPlayer = (room, uid, type, data, data2) => {
        if(!room || !io.sockets.adapter.rooms[room]) return;
        for(const sockets in io.sockets.adapter.rooms[room].sockets) {
            if(sockets != uid) {
                const player = io.sockets.connected[sockets];
                if(player)
                    player.emit(type, data, data2);
            }
        }
    }
    

    const sendPacketInRoom = (room, type, data) => {
        if(!room || !io.sockets.adapter.rooms[room]) return;
        io.sockets.in(room).emit(type, data);
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

const createRandomToken = () => {
    return crypto.randomBytes(28).toString("hex");
}