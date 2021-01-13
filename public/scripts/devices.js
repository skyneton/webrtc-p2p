const devices = [];

const callState = {
    video: false, //캠이 켜져있는지
    audio: false, //마이크가 켜져있는지
    desktop: false, //화면공유가 켜져있는지
    hasAudio: false, //마이크가 있는지
    hasVideo: false, //캠이 있는지
};

window.onunload = () => {
    closeState();
}

window.onload = event => {
    DeviceSetting();
}


const closeState = () => {
    callState.video = false;
    callState.audio = false;
    callState.desktop = false;

    closePeerConnectionAll();

    for(const key in devices) {
        devices[key].getTracks().forEach(track => track.stop());
        delete devices[key];
    }
}

async function DeviceSetting() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    callState.hasAudio = await audioCheck();
    callState.hasVideo = await cameraCheck();

    if(callState.audio && callState.hasAudio) turnAudioState(true);
    if(callState.video && callState.hasVideo) turnVideoState(true);
}

async function getConnectedDevices(type) { //장치가 있는지 확인
    return (await navigator.mediaDevices.enumerateDevices()).filter(device => device.kind === type);
}

async function audioCheck() { //마이크 있는지
    const audios = await getConnectedDevices('audioinput');
    return (audios && audios.length > 0);
}

async function cameraCheck() { //캠 있는지
    const cameras = await getConnectedDevices('videoinput');
    return (cameras && cameras.length > 0);
}


navigator.mediaDevices.ondevicechange = event => {
    DeviceSetting();
};

const turnAudioState = (state = false) => {
    if(state) {
        const query = {
            "audio": {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 50000
            }};
        
        navigator.mediaDevices.getUserMedia(query).then(function(stream) {
            devices["Audio"] = stream;
            addStream(devices["Audio"]);
            callState.audio = state;
            
            socket.emit("RTCConnection2");
            socket.emit("audioStatus", {status: callState.audio, streamId: devices["Audio"].id});

            if(devices["Audio"].getAudioTracks().length > 0) {
                devices["Audio"].getAudioTracks().onended = () => {
                    turnAudioState(false);
                }
            }

        }).catch(function(err) {
            console.log(err.name + ": " + err.message);
        });
    }else {
        callState.audio = state;
        socket.emit("RTCConnection");
        socket.emit("audioStatus", {status: callState.audio, streamId: devices["Audio"].id});
        devices["Audio"].getTracks().forEach(track => {
            track.stop();
        });

        delete devices["Audio"];
    }
}

const turnDesktopState = (state = false) => {
    if(state) {
        const query = {
            "video": {
                "cursor": "always",
                /*"width": {
                    "max": 1024
                }, "height": {
                    "max": 720
                }, */"frameRate": {
                    "max": 60
                }
            },
            audio: {
                echCancellation: true,
                noiseSuppression: true,
                sampleRate: 50000
            }
        }

        navigator.mediaDevices.getDisplayMedia(query).then(stream => {
            devices["DesktopShare"] = stream;
            addStream(devices["DesktopShare"]);
            callState.desktop = state;

            socket.emit("RTCConnection2");
            socket.emit("desktopStatus", {status: callState.desktop, streamId: devices["DesktopShare"].id});

            if(devices["DesktopShare"].getVideoTracks().length > 0)
                userDesktopVideoCreate(new MediaStream(devices["DesktopShare"].getVideoTracks()), socket.id);
            
                devices["DesktopShare"].getVideoTracks()[0].onended = () => {
                    turnDesktopState(false);
                }
        }).catch(function(err) {
            console.log(err.name + ": " + err.message);
        });
    }else {
        callState.desktop = state;
        socket.emit("desktopStatus", {status: callState.desktop, streamId: devices["DesktopShare"].id});
        socket.emit("RTCConnection");

        userDesktopVideoDelete(socket.id);

        if(devices["DesktopShare"]) {
            removeStream(devices["DesktopShare"]);
            devices["DesktopShare"].getTracks().forEach(track => {
                track.stop();
            });
            delete devices["DesktopShare"];
        }
    }
}

const turnVideoState = (state = false) => {
    if(state) {
        const query = {
            "video": {
                /*"width": {
                    "max": 1024
                }, "height": {
                    "max": 720
                }, */"frameRate": {
                    "max": 60
                }
            }};
        
        navigator.mediaDevices.getUserMedia(query).then(function(stream) {
            devices["Video"] = stream;
            addStream(devices["Video"]);
            callState.video = state;
            
            socket.emit("RTCConnection2");
            socket.emit("videoStatus", {status: callState.video, streamId: devices["Video"].id});

            if(devices["Video"].getAudioTracks().length > 0) {
                devices["Video"].getAudioTracks().onended = () => {
                    turnVideoState(false);
                }
            }
            userCamVideoCreate(devices["Video"], socket.id);
        }).catch(function(err) {
            console.log(err.name + ": " + err.message);
        });
    }else {
        callState.video = state;
        socket.emit("RTCConnection");
        socket.emit("videoStatus", {status: callState.video, streamId: devices["Video"].id});
        devices["Video"].getTracks().forEach(track => {
            track.stop();
        });

        delete devices["Video"];

        userCamVideoDelete(socket.id);
    }
}