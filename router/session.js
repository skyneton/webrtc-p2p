const session = require("express-session");
module.exports.get = () => {
    return session({
        secret: 'IE_7',
        resave: false,
        saveUninitialized: true
    });
}

module.exports.used = [];