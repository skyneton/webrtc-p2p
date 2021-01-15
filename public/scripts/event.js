document.getElementsByClassName("fullpagemode")[0].onclick = () => {
    if(hasAlert()) {
        event.preventDefault();
        return false;
    }
    const live = document.getElementsByClassName("live_room")[0];
    live.requestFullscreen() || live.webkitRequestFullscreen() || live.mozRequestFullScreen() || live.msRequestFullscreen();
}

document.getElementsByClassName("defaultpagemode")[0].onclick = () => {
    if(hasAlert()) {
        event.preventDefault();
        return false;
    }
    const live = document.getElementsByClassName("live_room")[0];
    document.exitFullscreen();
}

document.getElementsByClassName("live_room")[0].onfullscreenchange = () => {
    const full = document.getElementsByClassName("fullpagemode")[0];
    const basic = document.getElementsByClassName("defaultpagemode")[0];
    const sidemenu = document.getElementsByClassName("setting_box_left")[0];
    const centermenu = document.getElementsByClassName("setting_box_center")[0];
    const main_video = document.getElementsByClassName("user_main_video")[0];
    const header = document.getElementsByClassName("select_top_header")[0];
    if(!!document.fullscreenElement) {
        basic.style.display = "inline";
        full.style.display = null;
        sidemenu.style.display = "none";
        centermenu.style.display = "block";
        if(main_video && main_video.getElementsByClassName("main_nametag").length > 0) main_video.getElementsByClassName("main_nametag")[0].style.display = "none";
        if(header) header.style.display = "none";
    }else {
        basic.style.display = null;
        full.style.display = "inline";
        sidemenu.style.display = null;
        centermenu.style.display = null;
        if(main_video && main_video.getElementsByClassName("main_nametag").length > 0) main_video.getElementsByClassName("main_nametag")[0].style.display = null;
        if(header) header.style.display = null;
    }
}

document.getElementsByClassName("chat_menu_state")[0].onclick = () => {
    if(hasAlert()) {
        event.preventDefault();
        return false;
    }
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
    if(hasAlert()) {
        event.preventDefault();
        return false;
    }
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
    if(hasAlert()) {
        event.preventDefault();
        return false;
    }
    if(event.keyCode == 13 && !event.shiftKey) {
        event.preventDefault();
        document.getElementsByClassName("chat_send")[0].click();
    }
}

document.getElementsByClassName("chat_send")[0].onclick = () => {
    if(hasAlert()) {
        event.preventDefault();
        return false;
    }
    const chat = document.getElementsByClassName("chat_input")[0].value;
    if(chat.trim().replace(/ /gi, "").replace(/\n/gi, "").replace(/　/gi, "").length == 0) return;
    document.getElementsByClassName("chat_input")[0].value = null;

    socket.emit("chat", chat.trim());
}

document.getElementsByClassName("user_camera_toggle")[0].onclick = () => {
    if(hasAlert()) {
        event.preventDefault();
        return false;
    }
    if(callState.hasVideo)
        turnVideoState(!callState.video);
}


document.getElementsByClassName("user_desktop_toggle")[0].disabled = !navigator.mediaDevices.getDisplayMedia || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
if(!navigator.mediaDevices.getDisplayMedia || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
    document.getElementsByClassName("user_desktop_toggle")[0].style.display = "none";

document.getElementsByClassName("user_desktop_toggle")[0].onclick = () => {
    if(hasAlert()) {
        event.preventDefault();
        return false;
    }
    if(!(!navigator.mediaDevices.getDisplayMedia || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)))
        turnDesktopState(!callState.desktop);
}

document.getElementsByClassName("createURL")[0].onclick = () => {
    if(hasAlert()) {
        event.preventDefault();
        return false;
    }
    socket.emit("createToken");
}

document.getElementsByClassName("user_audio_toggle")[0].onclick = () => {
    if(hasAlert()) {
        event.preventDefault();
        return false;
    }
    if(callState.hasAudio)
        turnAudioState(!callState.audio);
}

document.getElementsByClassName("user_name_select")[0].onkeydown = userSearchAll;
document.getElementsByClassName("user_name_select")[0].onkeyup = userSearchAll;


function userSearchAll() {
    if(hasAlert()) {
        event.preventDefault();
        return false;
    }
    const userlist = document.getElementsByClassName("user_room_userlist_box")[0].children;
    for(let i = 0; i < userlist.length; i++) {
        if(userlist[i].hasAttribute("hidden")) userlist[i].removeAttribute("hidden");
    }
    if(this.value.trim().length == 0) return;
    for(let i = 0; i < userlist.length; i++) {
        if(userlist[i].getElementsByClassName("userlistItem_nametag").length == 0) continue;
        const name = userlist[i].getElementsByClassName("userlistItem_nametag")[0].innerText.toUpperCase();
        if(name.includes(this.value.toUpperCase())) continue;
        let index = 0;
        for(let search = 0; search < name.length && index > this.value.length; search++) {
            if(this.value[index] == name[search] || this.value[index] == getFirstChar(name[search]) || this.value[index] == getMiddleChar(name[search]) || this.value == getLastChar(name[search])) {
                index++; continue;
            }
            if(index == this.value.length && (getFirstChar(this.value[index]) == getFirstChar(name[search]) && (this.value[index] == getMiddleChar(this.value[index]) || getMiddleChar(this.value[index]) == getMiddleChar(name[search]) && (this.value[index] == getLastChar(this.value[index] || getLastChar(this.value[index]) == getLastChar(name[search])))))) {
                index++; continue;
            }else index = 0;
        }

        if(index <= this.value.length) {
            userlist[i].setAttribute("hidden", true);
        }
    }
}

const getFirstChar = char => {
    return ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'][Math.floor((char.charCodeAt() - 44032)/588)] || char;
}

const getMiddleChar = char => {
    return ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'][((char.charCodeAt()- 44032) / 28) % 21] || char;
}

const getLastChar = char => {
    return ['ㄱ','ㄲ', 'ㄳ','ㄴ','ㄵ', 'ㄶ', 'ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'][(char.charCodeAt() - 44032) % 28 - 1] || char;
}