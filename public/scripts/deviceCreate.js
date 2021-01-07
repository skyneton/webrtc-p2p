const userCamVideoCreate = (stream, uid) => {
    const e = document.createElement("video");
    e.setAttribute("class", `${uid}_video`);
    e.setAttribute("autoplay", true);
    if("srcObject" in e)
        e.srcObject = stream;
    else
        e.src = window.URL.createObjectURL(stream);

    document.body.appendChild(e);
};

const userCamVideoDelete = uid => {
    const e = document.getElementsByClassName(`${uid}_video`);
    if(e.length > 0) {
        for(let i = 0; i < e.length; i++)
            e[i].remove();
    }
};


const userAudioCreate = (stream, uid) => {
    const e = document.createElement("audio");
    e.setAttribute("class", `${uid}_audio`);
    e.setAttribute("autoplay", true);
    if("srcObject" in e)
        e.srcObject = stream;
    else
        e.src = window.URL.createObjectURL(stream);
        
    document.body.appendChild(e);
};

const userAudioDelete = uid => {
    const e = document.getElementsByClassName(`${uid}_audio`);
    if(e.length > 0) {
        for(let i = 0; i < e.length; i++)
            e[i].remove();
    }
};


const userDesktopVideoCreate = (stream, uid) => {
    const e = document.createElement("video");
    e.setAttribute("class", `${uid}_desktopVideo`);
    e.setAttribute("autoplay", true);
    if("srcObject" in e)
        e.srcObject = stream;
    else
        e.src = window.URL.createObjectURL(stream);
        
    document.body.appendChild(e);
};

const userDesktopVideoDelete = uid => {
    const e = document.getElementsByClassName(`${uid}_desktopVideo`);
    if(e.length > 0) {
        for(let i = 0; i < e.length; i++)
            e[i].remove();
    }
};

const userDesktopAudioCreate = (stream, uid) => {
    const e = document.createElement("audio");
    e.setAttribute("class", `${uid}_desktopAudio`);
    e.setAttribute("autoplay", true);
    if("srcObject" in e)
        e.srcObject = stream;
    else
        e.src = window.URL.createObjectURL(stream);
        
    document.body.appendChild(e);
};

const userDesktopAudioDelete = uid => {
    const e = document.getElementsByClassName(`${uid}_desktopAudio`);
    if(e.length > 0) {
        for(let i = 0; i < e.length; i++)
            e[i].remove();
    }
};