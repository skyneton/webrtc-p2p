let selectSid;
let videoLock = false;

const userCamVideoCreate = (stream, uid) => {
	const isSelected = !!document.getElementsByClassName("container_room")[0].style.display;
    const e = document.createElement("video");
    e.setAttribute("class", `camera_${uid} userCamera`);
    if("srcObject" in e)
        e.srcObject = stream;
    else
		e.src = window.URL.createObjectURL(stream);
		

	if(isSelected) {
		if(selectSid && selectSid.get() == uid && document.getElementsByClassName("user_main_video")[0].getElementsByClassName(`desktopvideo_${uid}`).length == 0)
			selectModeChange(uid, e);
		else
			document.getElementsByClassName("user_select_box")[0].getElementsByClassName(`selectbox_${uid}`)[0].appendChild(e);
	}else
		document.getElementsByClassName("container_room")[0].getElementsByClassName(`containerbox_${uid}`)[0].getElementsByClassName("container_boxshape")[0].appendChild(e);

	e.onloadedmetadata = () => {
		e.play().catch(error => {
			playError(e);
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
			playError(e);
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
	
	if(videoLock && selectSid.get() != uid)
		document.getElementsByClassName("user_select_box")[0].getElementsByClassName(`selectbox_${uid}`)[0].appendChild(e);
	else
		selectModeChange(uid, e);
	// if(isSelected)
	// 	document.getElementsByClassName("user_select_box")[0].getElementsByClassName(`selectbox_${uid}`)[0].appendChild(e);
	// else
	// 	document.getElementsByClassName("container_room")[0].getElementsByClassName(`containerbox_${uid}`)[0].getElementsByClassName("container_boxshape")[0].appendChild(e);

	e.onloadedmetadata = () => {
		e.play().catch(error => {
			playError(e);
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
		if(videoLock) {
			selectModeChange(uid, document.getElementsByClassName(`camera_${uid}`));
		}else {
			const vid = getHasDesktopVideoId();
			if(vid && document.getElementsByClassName(`desktopvideo_${vid}`).length > 0) {
				document.getElementsByClassName(`desktopvideo_${vid}`)[0].play().catch(error => {
					playError(document.getElementsByClassName(`desktopvideo_${vid}`)[0]);
				});
				selectModeChange(vid, document.getElementsByClassName(`desktopvideo_${vid}`)[0]);
			}else defaultModeChange();
		}
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
			playError(e);
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

const userBoxCreate = (uid, name) => {
	const container_loc = document.getElementsByClassName("container_room")[0].firstElementChild;
	const topbar_loc = document.getElementsByClassName("user_select_box")[0];
	const user_loc = document.getElementsByClassName("user_room")[0].getElementsByClassName("user_room_userlist_box")[0];

	if(container_loc.getElementsByClassName(`containerbox_${uid}`).length == 0) {
		const container_box = document.createElement("div");
		if(uid == socket.id)
			container_box.setAttribute("me", true);
		container_box.setAttribute("class", `containerbox_${uid} container_boxitem`);
		const container_shape = document.createElement("div");
		container_shape.setAttribute("class", "container_boxshape");

		const name_tag = document.createElement("div");
		name_tag.setAttribute("class", "userbox_nametag");
		name_tag.innerHTML = name;

		container_shape.appendChild(name_tag);
		container_box.appendChild(container_shape);

		let target;
		for(let i = 0; i < container_loc.children.length; i++) {
			if(container_loc.children[i].getElementsByClassName("userbox_nametag").length > 0) {
				let maxlen = container_loc.children[i].getElementsByClassName("userbox_nametag")[0].innerText.length;
				if(name_tag.innerText.length > maxlen) maxlen = name_tag.innerText.length;
				if(container_loc.children[i].getElementsByClassName("userbox_nametag")[0].innerText.padStart(maxlen, " ") > name_tag.innerText.padStart(maxlen, " ")) {
					target = container_loc.children[i];
					break;
				}
			}
		}
		container_loc.insertBefore(container_box, target);

		container_box.onclick = () => {
			let item = document.getElementsByClassName(`desktopvideo_${uid}`)[0];
			if(!item) item = document.getElementsByClassName(`camera_${uid}`)[0];
			else item.play(error => {
				playError(item);
			});
			selectModeChange(uid, item);
		}
	}

	if(topbar_loc.getElementsByClassName(`selectbox_${uid}`).length == 0) {
		const topbar_box = document.createElement("div");
		if(uid == socket.id)
			topbar_box.setAttribute("me", true);
		topbar_box.setAttribute("class", `selectbox_${uid} select_boxitem`);

		const name_tag = document.createElement("span");
		name_tag.setAttribute("class", "userbox_nametag");
		name_tag.innerHTML = name;
		topbar_box.appendChild(name_tag);
		
		let target;
		for(let i = 0; i < topbar_loc.children.length; i++) {
			if(topbar_loc.children[i].getElementsByClassName("userbox_nametag").length > 0) {
				let maxlen = topbar_loc.children[i].getElementsByClassName("userbox_nametag")[0].innerText.length;
				if(name_tag.innerText.length > maxlen) maxlen = name_tag.innerText.length;
				if(topbar_loc.children[i].getElementsByClassName("userbox_nametag")[0].innerText.padStart(maxlen, " ") > name_tag.innerText.padStart(maxlen < " ")) {
					target = topbar_loc.children[i];
					break;
				}
			}
		}
		topbar_loc.insertBefore(topbar_box, target);

		topbar_box.onclick = () => {
			videoLock = false;
			document.getElementsByClassName("main_video_lock")[0].style.display = null;
			let item = document.getElementsByClassName(`desktopvideo_${uid}`)[0];
			if(!item) item = document.getElementsByClassName(`camera_${uid}`)[0];
			else item.play().catch(error => {
				playError(item);
			});
			selectModeChange(uid, item);
		}

		topbar_box.ondblclick = () => {
			videoLock = true;
			document.getElementsByClassName("main_video_lock")[0].style.display = "block";
			let item = document.getElementsByClassName(`desktopvideo_${uid}`)[0];
			if(!item) item = document.getElementsByClassName(`camera_${uid}`)[0];
			else item.play().catch(error => {
				playError(item);
			})
			selectModeChange(uid, item);
		}
	}

	if(user_loc.getElementsByClassName(`userlistbox_${uid}`).length == 0) {
		const user_box = document.createElement("div");
		if(uid == socket.id)
			user_box.setAttribute("me", true);
		user_box.setAttribute("class", `userlistbox_${uid} userlistItem`);

		const name_tag = document.createElement("span");
		name_tag.setAttribute("class", "userlistItem_nametag");
		name_tag.innerHTML = name;

		user_box.appendChild(name_tag);
		
		let target;
		for(let i = 0; i < user_loc.children.length; i++) {
			if(user_loc.children[i].getElementsByClassName("userlistItem_nametag").length > 0) {
				let maxlen = user_loc.children[i].getElementsByClassName("userlistItem_nametag")[0].innerText.length;
				if(name_tag.innerText.length > maxlen) maxlen = name_tag.innerText.length;
				if(user_loc.children[i].getElementsByClassName("userlistItem_nametag")[0].innerText.padStart(maxlen, " ") > name_tag.innerText.padStart(maxlen, " ")) {
					target = user_loc.children[i];
					break;
				}
			}
		}
		user_loc.insertBefore(user_box, target);

		const searchValue = document.getElementsByClassName("user_name_select")[0].value.toUpperCase();
		const myname = name_tag.innerText.toUpperCase();
		if(searchValue.trim().length > 0 && !myname.includes(searchValue)) {
			let index = 0;
			for(let search = 0; search < myname.length && index > searchValue.length; search++) {
				if(searchValue[index] == myname[search] || searchValue[index] == getFirstChar(myname[search]) || searchValue[index] == getMiddleChar(myname[search]) || searchValue[index] == getLastChar(myname[search])) {
					index++; continue;
				}
				if(index == searchValue.length && (getFirstChar(searchValue[index]) == getFirstChar(myname[search]) && (searchValue[index] == getMiddleChar(searchValue[index]) || getMiddleChar(searchValue[index]) == getMiddleChar(myname[search]) && (searchValue[index] == getLastChar(searchValue[index] || getLastChar(searchValue[index]) == getLastChar(myname[search])))))) {
					index++; continue;
				}else index = 0;
			}
	
			if(index <= searchValue.length) {
				user_box.setAttribute("hidden", true);
			}
		}
	}
};

const userBoxDelete = uid => {
	const container_box = document.getElementsByClassName(`containerbox_${uid}`);
	const topbar_box = document.getElementsByClassName(`selectbox_${uid}`);
	const user_box = document.getElementsByClassName(`userlistbox_${uid}`);
	for(let i = 0; i < container_box.length; i++) container_box[i].remove();
	for(let i = 0; i < topbar_box.length; i++) topbar_box[i].remove();
	for(let i = 0; i < user_box.length; i++) user_box[i].remove();

	const desktopVideo = document.getElementsByClassName(`desktopvideo_${uid}`);
	const cameraVideo = document.getElementsByClassName(`camera_${uid}`);
	for(let i = 0; i < desktopVideo.length; i++) desktopVideo[i].remove();
	for(let i = 0; i < cameraVideo.length; i++) cameraVideo[i].remove();
	
	
	if(selectSid && uid == selectSid.get() || !document.getElementsByClassName("container_room")[0].style.display) {
		const vid = getHasDesktopVideoId();
		if(videoLock) {
			videoLock = false;
			document.getElementsByClassName("main_video_lock")[0].style.display = null;
		}
		if(vid && document.getElementsByClassName(`desktopvideo_${vid}`).length > 0) {
			document.getElementsByClassName(`desktopvideo_${vid}`)[0].play().catch(error => {
				playError(document.getElementsByClassName(`desktopvideo_${vid}`)[0]);
			});
			selectModeChange(vid, document.getElementsByClassName(`desktopvideo_${vid}`)[0]);
		}else
			defaultModeChange();
	}
}

const selectModeChange = (uid, video) => {
	const main = document.getElementsByClassName("user_main_video")[0];
	if(selectSid) {
		const box = document.getElementsByClassName("user_select_box")[0].getElementsByClassName(`selectbox_${selectSid.get()}`)[0];
		for(let obj = 0; obj < main.children.length;) {
			const objects = main.children[obj];
			if(objects.className == "main_nametag") {
				objects.remove();
				continue;
			}
			if(objects.className == "main_video_lock") {
				obj++;
				continue;
			}
			box.appendChild(objects);
			if(objects.className.substring(0, 13) == "desktopvideo_" || objects.className.substring(0, 13) == "desktopaudio_")
				objects.pause();
		}
	}

	const userBoxs = document.getElementsByClassName("user_select_box")[0].getElementsByClassName("select_boxitem");
	for(let i = 0; i < userBoxs.length; i++) {
		if(userBoxs[i].hasAttribute("selected")) userBoxs[i].removeAttribute("selected");
	}

	// const classes = video.className.split(" ");
	// for(let i = 0; i < classes.length; i++) {
	// 	if(classes[i].startsWith("desktopvideo_")) {
	// 		selectSid = new readOnly(classes[i].substr(13));
	// 		break;
	// 	}else if(classes[i].startsWith("camera_")) {
	// 		selectSid = new readOnly(classes[i].substr(7));
	// 		break;
	// 	}
	// }
	selectSid = new readOnly(uid);

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
			if(userSelectBox.length == 0) userBoxCreate(className, className);
			if(userSelectBox.length == 0) continue;

			const box = container.children[i].getElementsByClassName("container_boxshape")[0].children;
			for(let item = 0; item < box.length;) {
				if(box[item].tagName.toUpperCase() == "VIDEO" && (box[item].className.startsWith("userDesktopCamera") || box[item].className.includes(" userDesktopCamera") || box[item].className.startsWith("userCamera") || box[item].className.includes(" userCamera"))) {
					userSelectBox[0].appendChild(box[item]);
				}else item++;
			}
		}
	}

	document.getElementsByClassName(`selectbox_${selectSid.get()}`)[0].setAttribute("selected", true);

	if(document.getElementsByClassName(`selectbox_${selectSid.get()}`)[0].getElementsByClassName("userbox_nametag").length > 0) {
		const nametag = document.createElement("span");
		nametag.setAttribute("class", "main_nametag");
		nametag.innerHTML = document.getElementsByClassName(`selectbox_${selectSid.get()}`)[0].getElementsByClassName("userbox_nametag")[0].innerHTML;
		main.appendChild(nametag);

		if(!!document.fullscreenElement && document.fullscreenElement == document.getElementsByClassName("live_room")[0]) nametag.style.display = "none";
	}

	if(video)
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
		for(let i = 0; i < main.children.length;) {
			const objects = main.children[i];
			if(objects.className == "main_nametag") {
				objects.remove();
				continue;
			}
			if(objects.className == "main_video_lock") {
				i++;
				continue;
			}
			box.appendChild(objects);
			if(objects.className.substring(0, 13) == "desktopvideo_")
				objects.pause();
		}
		selectSid = undefined;
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
		for(let item = 0; item < items.length;) {
			if(items[item].className.endsWith("_nametag") || items[item].tagName.toUpperCase() == "SPAN") {
				item++;
				continue;
			}
			contain[0].appendChild(items[item]);
		}
	}

	document.getElementsByClassName("select_room")[0].style.display = null;
	document.getElementsByClassName("container_room")[0].style.display = null;
}

const playError = e => {
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
}