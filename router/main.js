const session = require("./session");
const express = require('express');
const path = require("path");
const crypto = require("crypto");

module.exports = (app, io) => {
    app.get("/", (req, res) => {
        res.redirect("/live");
    })
    app.get('/live', (req, res) => {
        //session.data[req.session.id] = { "name": req.session.name, "uid": req.session.uid };
        session.data[req.session.id] = { "name": "익명", "uid": req.session.id };
        if(req.session.room && io.sockets.adapter.rooms[req.session.room] && io.sockets.adapter.rooms[req.session.room].allow.includes(req.session.id)) {
            session.data[req.session.id].room = req.session.room;
        }else
			session.data[req.session.id].allow = [];
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('live', {
            title: "RTC LIVE",
            key: req.session.id
        });
    });

    app.get('/live/:room/:random', (req, res) => {
        if(io.sockets.adapter.rooms[req.params.room] && io.sockets.adapter.rooms[req.params.room].token && io.sockets.adapter.rooms[req.params.room].token == req.params.random && (!io.sockets.adapter.rooms[req.params.room].allow || !io.sockets.adapter.rooms[req.params.room].allow.includes(req.session.uid))) {
            req.session.room = req.params.room;
            io.sockets.adapter.rooms[req.params.room].allow.push(req.session.uid);
			const url = `/live/${req.params.room}/${req.params.random}`;
			res.cookie("URL", url, { maxAge: 600000, HttpOnly: true });
        }
        res.redirect("/live");
    });

    app.get('/live/:random', (req, res) => {
        if(io.sockets.adapter.rooms[session.tokens[req.params.random]]
            && io.sockets.adapter.rooms[session.tokens[req.params.random]].token
            && io.sockets.adapter.rooms[session.tokens[req.params.random]].token == req.params.random
            && (!io.sockets.adapter.rooms[session.tokens[req.params.random]].allow || !io.sockets.adapter.rooms[session.tokens[req.params.random]].allow.includes(req.session.id))) {
            req.session.room = session.tokens[req.params.random];
            io.sockets.adapter.rooms[req.session.room].allow.push(req.session.id);
			const url = `/live/${req.params.random}`;
			res.cookie("URL", url, { maxAge: 600000, HttpOnly: true });
        }
        res.redirect("/live");
    });

    app.post('/userdata', (req, res) => {
		if(!not(req.session.name) && !not(req.session.uid)) return;
        if(!req.body || not(req.body.name) || not(req.body.uid)) return;
        req.session.name = req.body.name;
        req.session.uid = req.body.uid;
		if(!not(req.cookies.URL)) res.redirect(req.cookies.URL);
		else res.redirect("/live");
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