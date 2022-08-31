let express = require('express');
let app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(require("./router/session").session);

app.use(require("cookie-parser")()); //쿠키 사용

const bodyParser = require('body-parser'); //POST 방식 사용시
app.use(bodyParser.urlencoded({extended: true}));

const port = 80;

const http = require('http');
const server = http.createServer(app).listen(port, () => {
    log("::Server Open:: PORT: " + port);
});

const io = require("socket.io").listen(server);

require('./router/socket')(io);
require('./router/main')(app, io);

const turn = require("node-turn");
new turn({
	listeningPort: 5349,
	listeningIps: ["0.0.0.0"],
	authMech: "long-term",
	credentials: {
		"turnserver": "turnserver"
	}
}).start();

//function
const log = msg => {
	const logDate = new Date();
	const logD = "[" + logDate.getFullYear().toString().substring(2) + "/" + (logDate.getMonth() + 1).toString().padStart(2,'0') + " " + logDate.getHours().toString().padStart(2,'0') + ":" + logDate.getMinutes().toString().padStart(2,'0') + ":" + logDate.getSeconds().toString().padStart(2,'0') + "]";
	console.log(logD + " " + msg);
}