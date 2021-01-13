const userCamVideoCreate = (stream, uid) => {
    const e = document.createElement("video");
    e.setAttribute("class", `${uid}_video`);
    if("srcObject" in e)
        e.srcObject = stream;
    else
        e.src = window.URL.createObjectURL(stream);

    document.body.appendChild(e);
	e.onloadedmetadata = () => {
		e.play().catch(error => {
			window.addEventListener('click', play);
			window.addEventListener('contextmenu', play);
			window.addEventListener('focus', play);
			window.addEventListener('touchmove', play);
			
			createInteractAlert();
			
			function play() {
				e.play().then(_ => {
					window.removeEventListener('click', play);
					window.removeEventListener('contextmenu', play);
					window.removeEventListener('focus', play);
					window.removeEventListener('touchmove', play);
					
					removeInteractAlert();
				});
			}
		});
	};
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
    if("srcObject" in e)
        e.srcObject = stream;
    else
        e.src = window.URL.createObjectURL(stream);
        
    document.body.appendChild(e);
	e.onloadedmetadata = () => {
		e.play().catch(error => {
			window.addEventListener('click', play);
			window.addEventListener('contextmenu', play);
			window.addEventListener('focus', play);
			window.addEventListener('touchmove', play);
			
			createInteractAlert();
			
			function play() {
				e.play().then(_ => {
					window.removeEventListener('click', play);
					window.removeEventListener('contextmenu', play);
					window.removeEventListener('focus', play);
					window.removeEventListener('touchmove', play);
					
					removeInteractAlert();
				});
			}
		});
	};
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
    if("srcObject" in e)
        e.srcObject = stream;
    else
        e.src = window.URL.createObjectURL(stream);
        
    document.body.appendChild(e);
	e.onloadedmetadata = () => {
		e.play().catch(error => {
			window.addEventListener('click', play);
			window.addEventListener('contextmenu', play);
			window.addEventListener('focus', play);
			window.addEventListener('touchmove', play);
			
			createInteractAlert();
			
			function play() {
				e.play().then(_ => {
					window.removeEventListener('click', play);
					window.removeEventListener('contextmenu', play);
					window.removeEventListener('focus', play);
					window.removeEventListener('touchmove', play);
					
					removeInteractAlert();
				});
			}
		});
	};
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
	
    if("srcObject" in e)
        e.srcObject = stream;
    else
        e.src = window.URL.createObjectURL(stream);
        
    document.body.appendChild(e);
	e.onloadedmetadata = () => {
		e.play().catch(error => {
			window.addEventListener('click', play);
			window.addEventListener('contextmenu', play);
			window.addEventListener('focus', play);
			window.addEventListener('touchmove', play);
			
			createInteractAlert();
			
			function play() {
				e.play().then(_ => {
					window.removeEventListener('click', play);
					window.removeEventListener('contextmenu', play);
					window.removeEventListener('focus', play);
					window.removeEventListener('touchmove', play);
					
					removeInteractAlert();
				});
			}
		});
	};
};

const userDesktopAudioDelete = uid => {
    const e = document.getElementsByClassName(`${uid}_desktopAudio`);
    if(e.length > 0) {
        for(let i = 0; i < e.length; i++)
            e[i].remove();
    }
};

const createInteractAlert = _ => {
	const box = document.createElement("div");
	box.setAttribute("class", "interactAlert");
	
	box.innerText = "화면 클릭등의 활동시 영상과 음성이 출력됩니다.";
	
	document.body.appendChild(box);
};

const removeInteractAlert = _ => {
	if(document.getElementsByClassName("interactAlert").length > 0)
		document.getElementsByClassName("interactAlert")[0].remove();
};

const userBoxCreate = uid => {
	const container_loc = document.getElementsByClassName("container_room")[0].firstElementChild;
	const topbar_loc = document.getElementsByClassName("user_select_box")[0];

	if(container_loc.getElementsByClassName(`containerbox_${uid}`).length == 0) {
		const container_box = document.createElement("div");
		container_box.setAttribute("class", `containerbox_${uid} container_boxitem`);
		container_loc.appendChild(container_box);
	}

	if(topbar_loc.getElementsByClassName(`selectbox_${uid}`).length == 0) {
		const topbar_box = document.createElement("div");
		topbar_box.setAttribute("class", `selectbox_${uid} select_boxitem`);
		topbar_loc.appendChild(topbar_box);
	}
};

const userBoxDelete = uid => {
	const container_box = document.getElementsByClassName(`containerbox_${uid}`);
	const topbar_box = document.getElementsByClassName(`selectbox_${uid}`);
	for(let i = 0; i < container_box.length; i++) container_box[i].remove();
	for(let i = 0; i < topbar_box.length; i++) topbar_box[i].remove();
}