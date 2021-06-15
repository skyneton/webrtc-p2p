const session = require("express-session");
module.exports.session = session({
    secret: 'IE_7',
    resave: false,
    saveUninitialized: true
});

module.exports.used = [];
module.exports.data = [];
module.exports.tokens = [];