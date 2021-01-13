const session = require("./session");

module.exports = (app) => {
    app.get('/live', (req, res) => {
        session.data[req.session.id] = { "name": req.session.name, "uid": req.session.uid };
        res.render('live', {
            title: "IE 7",
            key: req.session.id
        });
    });
}