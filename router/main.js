const session = require("./session");
const crypto = require("crypto");

module.exports = (app, io) => {
    app.get('/live', (req, res) => {
        session.data[req.session.id] = { "name": req.session.name, "uid": req.session.uid };
        if(req.session.room && io.sockets.adapter.rooms[req.session.room] && io.sockets.adapter.rooms[req.session.room].allow.includes(req.session.uid)) {
            session.data[req.session.uid].room = req.session.room;
        }
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('live', {
            title: "EDWOP LIVE",
            key: req.session.id
        });
    });

    app.get('/live/:room/:random', (req, res) => {
        if(io.sockets.adapter.rooms[req.params.room] && io.sockets.adapter.rooms[req.params.room].token && io.sockets.adapter.rooms[req.params.room].token == req.params.random && !io.sockets.adapter.rooms[req.params.room].allow.includes(req.session.uid)) {
            req.session.room = req.params.room;
            io.sockets.adapter.rooms[req.params.room].allow.push(req.session.uid);
        }
        res.redirect("/live");
    });

    app.post('/userdata', (req, res) => {
        if(!req.body || not(req.body.key) || not(res.session.ukey) || not(res.session.uid) || not(res.session.name) || not(req.body.name) || not(req.body.uid) || !req.session.error) return;
		if(res.session.ukey != req.body.key) {
			req.session.error = 1;
			return;
        }
        req.session.name = req.body.name;
        req.session.uid = req.body.uid;
    });
	
	app.post('/out', (req, res) => {
		if(!not(req.session.name))
			delete req.session.name;
		if(!not(req.session.uid))
			delete req.session.uid;
	});
}

const createRandomToken = () => {
    return crypto.randomBytes(28).toString("hex");
}

const not = a => {
    return a == undefined || a == null;
}