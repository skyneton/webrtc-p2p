const session = require("./session");

module.exports = (app) => {
    app.get('/live', (req, res) => {
        session.data[req.session.id] = { "name": req.session.name, "uid": req.session.uid };
        res.render('live', {
            title: "EDWOP LIVE",
            key: req.session.id
        });
    });

    app.get('/live/:uid/:random', (req, res) => {
        if(session.data[req.params.uid] && session.data[req.params.uid].token && session.data[req.params.uid].token == req.params.random) {
            session.data[req.session.id] = { "name": req.session.name, "uid": req.session.uid, "room": req.params.uid };
            res.render('live', {
                title: "EDWOP LIVE",
                key: req.session.id
            });
        }else {
            res.redirect("/live");
        }
    });
}