const peers = [];
const worker = [];

const configure = {
    iceServers: [{
        urls: `stun:live.edcan.kr:5349`
    }, {
        urls: `turn:live.edcan.kr:5349`,
        credential: 'turnserver',
        username: 'turnserver'
    }]
};

const createPeerConnection = () => {
    console.log(">>>> creating connection");

    const result = new RTCPeerConnection(configure);
    result.onicecandidate = handleIceCandidate;
    result.onaddstream = handleRemoteStreamAdded;
    console.log("Created RTCConnection");
    for(const streams in devices) {
        result.addStream(devices[streams]);
    }

    return result;
}

const closePeerConnectionAll = () => {
    for(const key in peers) {
        peers[key].close();
        delete peers[key];
    }
}

const handleIceCandidate = function() {
    if(event.candidate) {
		sendPeerData({
			type: "candidate",
			label: event.candidate.sdpMLineIndex,
			id: event.candidate.sdpMid,
			candidate: event.candidate.candidate,
        }, this.socketId);
    }
}

const handleRemoteStreamAdded = function() {
    const audio = worker[this.socketId+"_"+event.stream.id+"_audio"];
    const video = worker[this.socketId+"_"+event.stream.id+"_video"];
    const desktop = worker[this.socketId+"_"+event.stream.id+"_desktop"];

    if(audio)
        audioStatusChange(audio.streamId, audio.uid);
    if(video)
        videoStatusChange(video.streamId, video.uid);
    if(desktop)
        desktopStatusChange(desktop.streamId, desktop.uid);
}

const doCall = (pc, to) => {
    pc.createOffer()
        .then(sessionDescription => setLocalAndSendMessage(pc, sessionDescription, to))
        .catch(handleCreateOfferError);
}

const doAnswer = (pc, to) => {
    pc.createAnswer()
        .then(sessionDescription=> setLocalAndSendMessage(pc, sessionDescription, to))
        .catch(onCreateSessionDescriptionError);
}

const setLocalAndSendMessage = (pc, sessionDescription, to) => {
    pc.setLocalDescription(sessionDescription);
    sendPeerData(sessionDescription, to);
}

const handleCreateOfferError = error => {
    console.error("Falied to create session Description", error);
}

const onCreateSessionDescriptionError = error => {
    console.error("Falied to create session Description", error);
}

const addStream = stream => {
    for(const key in peers) {
        peers[key].addStream(stream);
    }
}

const removeStream = stream => {
    for(const key in peers) {
        peers[key].removeStream(stream);
    }
}