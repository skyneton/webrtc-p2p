const session = require("./session");

module.exports = (app) => {
    app.get('/live', (req, res) => {
        session.data[req.session.id] = { "name": req.session.name, "uid": req.session.uid };
        if(!req.session.time) req.session.time = new Date().getTime();
        session.data[req.session.id].time = req.session.time;
        if(req.session.room && session.data[req.session.room] && session.data[req.session.room].time < req.session.roomTime) {
            session.data[req.session.id].room = req.session.room;
        }
        res.render('live', {
            title: "EDWOP LIVE",
            key: req.session.id
        });
    });

    app.get('/live/:uid/:random', (req, res) => {
        if(session.data[req.params.uid] && session.data[req.params.uid].token && session.data[req.params.uid].token == req.params.random) {
            req.session.room = req.params.uid;
            req.session.roomTime = new Date().getTime();
        }
        res.redirect("/live");
    });
}