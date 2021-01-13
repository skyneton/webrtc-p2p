module.exports = (app) => {
    app.get('/live', (req, res) => {
        res.render('live', {
            title: "IE 7",
            key: req.session.id
        });
    });
}