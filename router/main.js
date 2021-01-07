module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('index', {
            title: "미정"
        });
    });
}