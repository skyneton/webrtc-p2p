let selectSid;

const userCamVideoCreate = (stream, uid) => {
	const isSelected = !!document.getElementsByClassName("container_room")[0].style.display;
    const e = document.createElement("video");
    e.setAttribute("class", `camera_${uid} userCamera`);
    if("srcObject" in e)
        e.srcObject = stream;
    else
        e.src = window.URL.createObjectURL(stream);

	if(isSelected)
		document.getElementsByClassName("user_select_box")[0].getElementsByClassName(`selectbox_${uid}`)[0].appendChild(e);
	else
		document.getElementsByClassName("container_room")[0].getElementsByClassName(`containerbox_${uid}`)[0].getElementsByClassName("container_boxshape")[0].appendChild(e);

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
    const e = document.getElementsByClassName(`camera_${uid}`);
    if(e.length > 0) {
        for(let i = 0; i < e.length; i++)
            e[i].remove();
    }
};


const userAudioCreate = (stream, uid) => {
    const e = document.createElement("audio");
    e.setAttribute("class", `mainaudio_${uid}`);
    if("srcObject" in e)
        e.srcObject = stream;
    else
        e.src = window.URL.createObjectURL(stream);
        
	document.getElementsByClassName("container_room")[0].getElementsByClassName(`containerbox_${uid}`)[0].getElementsByClassName("container_boxshape")[0].appendChild(e);
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
    const e = document.getElementsByClassName(`mainaudio_${uid}`);
    if(e.length > 0) {
        for(let i = 0; i < e.length; i++)
            e[i].remove();
    }
};


const userDesktopVideoCreate = (stream, uid) => {
	const isSelected = !!document.getElementsByClassName("container_room")[0].style.display;
    const e = document.createElement("video");
    e.setAttribute("class", `desktopvideo_${uid} userDesktopCamera`);
    if("srcObject" in e)
        e.srcObject = stream;
    else
        e.src = window.URL.createObjectURL(stream);
	
	selectModeChange(e);
	// if(isSelected)
	// 	document.getElementsByClassName("user_select_box")[0].getElementsByClassName(`selectbox_${uid}`)[0].appendChild(e);
	// else
	// 	document.getElementsByClassName("container_room")[0].getElementsByClassName(`containerbox_${uid}`)[0].getElementsByClassName("container_boxshape")[0].appendChild(e);

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
    const e = document.getElementsByClassName(`desktopvideo_${uid}`);
    if(e.length > 0) {
        for(let i = 0; i < e.length; i++)
            e[i].remove();
	}
	
	if(selectSid && uid == selectSid.get() || !document.getElementsByClassName("container_room")[0].style.display) {
		const vid = getHasDesktopVideoId();
		if(vid && document.getElementsByClassName(`desktopvideo_${vid}`).length > 0) selectModeChange(document.getElementsByClassName(`desktopvideo_${vid}`)[0]);
		defaultModeChange();
	}
};

const userDesktopAudioCreate = (stream, uid) => {
    const e = document.createElement("audio");
    e.setAttribute("class", `desktopaudio_${uid}`);
	
    if("srcObject" in e)
        e.srcObject = stream;
    else
        e.src = window.URL.createObjectURL(stream);
        
	document.getElementsByClassName("container_room")[0].getElementsByClassName(`containerbox_${uid}`)[0].getElementsByClassName("container_boxshape")[0].appendChild(e);
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
    const e = document.getElementsByClassName(`desktopaudio_${uid}`);
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
		const container_shape = document.createElement("div");
		container_shape.setAttribute("class", "container_boxshape");
		container_box.appendChild(container_shape);
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

const selectModeChange = video => {
	const main = document.getElementsByClassName("user_main_video")[0];
	if(selectSid) {
		const box = document.getElementsByClassName("user_select_box")[0].getElementsByClassName(`selectbox_${selectSid.get()}`)[0];
		for(let obj = 0; obj < main.children.length; obj++) {
			const objects = main.children[obj];
			box.appendChild(objects);
			if(objects.className.substring(0, 13) == "desktopvideo_" || objects.className.substring(0, 13) == "desktopaudio_")
				objects.pause();
		}
	}

	const userBoxs = document.getElementsByClassName("user_select_box")[0].getElementsByClassName("select_boxitem")[0];
	for(let i = 0; i < userBoxs.children.length; i++) {
		if(userBoxs.children[i].hasAttribute("selected")) userBoxs.children[i].removeAttribute("selected");
	}

	const classes = video.className.split(" ");
	for(let i = 0; i < classes.length; i++) {
		if(classes[i].startsWith("desktopvideo_")) {
			selectSid = new readOnly(classes[i].substr(13));
			break;
		}else if(classes[i].startsWith("camera_")) {
			selectSid = new readOnly(classes[i].substr(7));
			break;
		}
	}

	if(!document.getElementsByClassName("select_room")[0].style.display) {
		document.getElementsByClassName("select_room")[0].style.display = "flex";
		document.getElementsByClassName("container_room")[0].style.display = "none";

		const container = document.getElementsByClassName("container_room")[0].firstElementChild;
		for(let i = 0; i < container.children.length; i++) {
			const classNames = container.children[i].className.split(" ");
			let className;
			for(let n = 0; n < classNames.length; n++) {
				if(classNames[n].startsWith("containerbox_")) {
					className = classNames[n].substr(13);
					break;
				}
			}
			if(!className) continue;
			const userSelectBox = document.getElementsByClassName("user_select_box")[0].getElementsByClassName(`selectbox_${className}`);
			if(userSelectBox.length == 0) userBoxCreate(className);
			if(userSelectBox.length == 0) continue;

			const box = container.children[i].getElementsByClassName("container_boxshape")[0].children;
			for(let item = 0; item < box.length; item++) {
				if(box[item].tagName.toUpperCase() == "VIDEO" && (box[item].className.startsWith("userDesktopCamera") || box[item].className.includes(" userDesktopCamera") || box[item].className.startsWith("userCamera") || box[item].className.includes(" userCamera"))) {
					userSelectBox[0].appendChild(box[item]);
				}
			}
		}
	}

	document.getElementsByClassName(`selectbox_${selectSid.get()}`)[0].setAttribute("selected", true);

	main.appendChild(video);
}

const getHasDesktopVideoId = () => {
	const users = document.getElementsByClassName("user_select_box")[0].children;
	for(let i = 0; i < users.length; i++) {
		if(users[i].getElementsByClassName("userDesktopCamera").length > 0) {
			const classes = users[i].getElementsByClassName("userDesktopCamera")[0].className.split(" ");
			for(let i = 0; i < classes.length; i++) {
				if(classes[i].startsWith("desktopvideo_")) {
					return classes[i].substr(13);
				}
			}
		}
	}

	const container = document.getElementsByClassName("container_room")[0].firstElementChild.children;
	for(let i = 0; i < container.length; i++) {
		if(container[i].getElementsByClassName("userDesktopCamera").length > 0) {
			const classes = container[i].getElementsByClassName("userDesktopCamera")[0].className.split(" ");
			for(let i = 0; i < classes.length; i++) {
				if(classes[i].startsWith("desktopvideo_")) {
					return classes[i].substr(13);
				}
			}
		}
	}

	return null;
}

const defaultModeChange = () => {
	if(selectSid) {
		const main = document.getElementsByClassName("user_main_video")[0];
		const box = document.getElementsByClassName("user_select_box")[0].getElementsByClassName(`selectbox_${selectSid.get()}`)[0];
		for(let obj = 0; obj < main.children.length; obj++) {
			const objects = main.children[obj];
			box.appendChild(objects);
			if(objects.className.substring(0, 13) == "desktopvideo_" || objects.className.substring(0, 13) == "desktopaudio_")
				objects.pause();
		}
	}

	const userboxs = document.getElementsByClassName("user_select_box")[0].children;
	for(let i = 0; i < userboxs.length; i++) {
		const names = userboxs[i].className.split(" ");
		let className;
		for(let name = 0; name < names.length; name++) {
			if(names[name].startsWith("selectbox_")) className = names[name].substr(10);
		}
		if(!className) continue;
		const box = document.getElementsByClassName("container_room")[0].getElementsByClassName(`containerbox_${className}`);
		if(box.length == 0) continue;
		const contain = box[0].getElementsByClassName("container_boxshape");
		if(contain.length == 0) continue;
		const items = userboxs[i].children;
		for(let item = 0; item < items.length; item++) {
			contain[0].appendChild(items[i]);
		}
	}

	document.getElementsByClassName("select_room")[0].style.display = null;
	document.getElementsByClassName("container_room")[0].style.display = null;
}