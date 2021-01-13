document.getElementsByClassName("fullpagemode")[0].onclick = () => {
    const live = document.getElementsByClassName("live_room")[0];
    live.requestFullscreen() || live.webkitRequestFullscreen() || live.mozRequestFullScreen() || live.msRequestFullscreen();
}

document.getElementsByClassName("defaultpagemode")[0].onclick = () => {
    const live = document.getElementsByClassName("live_room")[0];
    document.exitFullscreen();
}

document.getElementsByClassName("live_room")[0].onfullscreenchange = () => {
    const full = document.getElementsByClassName("fullpagemode")[0];
    const basic = document.getElementsByClassName("defaultpagemode")[0];
    const sidemenu = document.getElementsByClassName("setting_box_left")[0];
    const centermenu = document.getElementsByClassName("setting_box_center")[0];
    if(!!document.fullscreenElement) {
        basic.style.display = "inline";
        full.style.display = null;
        sidemenu.style.display = "none";
        centermenu.style.display = "block";
    }else {
        basic.style.display = null;
        full.style.display = "inline";
        sidemenu.style.display = null;
        centermenu.style.display = null;
    }
}

document.getElementsByClassName("chat_menu_state")[0].onclick = () => {
    const chat = document.getElementsByClassName("chat_room")[0];
    const user = document.getElementsByClassName("user_room")[0];
    const side = document.getElementsByClassName("right_side")[0];
    if(!chat || !side) return;
    if(!!chat.style.display) {
        chat.style.display = null;
        if(!user || !user.style.display) side.style.display = null;
    }
    else {
        chat.style.display = "flex";
        side.style.display = "flex";
        document.getElementsByClassName("chatlistbox")[0].scrollTop = document.getElementsByClassName("chatlistbox")[0].scrollHeight;
    }
}

document.getElementsByClassName("user_menu_state")[0].onclick = () => {
    const chat = document.getElementsByClassName("chat_room")[0];
    const user = document.getElementsByClassName("user_room")[0];
    const side = document.getElementsByClassName("right_side")[0];
    if(!user || !side) return;
    if(!!user.style.display) {
        user.style.display = null;
        if(!chat || !chat.style.display) side.style.display = null;
    }
    else {
        user.style.display = "flex";
        side.style.display = "flex";
    }
}

document.getElementsByClassName("chat_input")[0].onkeydown = () => {
    if(event.keyCode == 13 && !event.shiftKey) {
        event.preventDefault();
        document.getElementsByClassName("chat_send")[0].click();
    }
}

document.getElementsByClassName("chat_send")[0].onclick = () => {
    const chat = document.getElementsByClassName("chat_input")[0].value;
    if(chat.replace(/ /gi, "").replace(/\n/gi, "").length == 0) return;
    document.getElementsByClassName("chat_input")[0].value = null;

    socket.emit("chat", chat);
}

document.getElementsByClassName("user_camera_toggle")[0].onclick = () => {
    if(callState.hasVideo)
        turnVideoState(!callState.video).then(result => {
            if(!result && document.getElementsByClassName("user_camera_toggle")[0].hasAttribute("activity")) document.getElementsByClassName("user_camera_toggle")[0].removeAttribute("activity");
            else if(result && !document.getElementsByClassName("user_camera_toggle")[0].hasAttribute("activity")) document.getElementsByClassName("user_camera_toggle")[0].setAttribute("activity", true);
        });
}


document.getElementsByClassName("user_desktop_toggle")[0].disabled = !navigator.mediaDevices.getDisplayMedia || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
document.getElementsByClassName("user_desktop_toggle")[0].onclick = () => {
    if(!(!navigator.mediaDevices.getDisplayMedia || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)))
        turnDesktopState(!callState.desktop).then(result => {
            if(!result && document.getElementsByClassName("user_desktop_toggle")[0].hasAttribute("activity")) document.getElementsByClassName("user_desktop_toggle")[0].removeAttribute("activity");
            else if(result && !document.getElementsByClassName("user_desktop_toggle")[0].hasAttribute("activity")) document.getElementsByClassName("user_desktop_toggle")[0].setAttribute("activity", true);
        });
}

document.getElementsByClassName("user_audio_toggle")[0].onclick = () => {
    if(callState.hasAudio)
        turnAudioState(!callState.audio).then(result => {
            if(!result && document.getElementsByClassName("user_audio_toggle")[0].hasAttribute("activity")) document.getElementsByClassName("user_audio_toggle")[0].removeAttribute("activity");
            else if(result && !document.getElementsByClassName("user_audio_toggle")[0].hasAttribute("activity")) document.getElementsByClassName("user_audio_toggle")[0].setAttribute("activity", true);
        });
}