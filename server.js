let express = require('express');
let app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(require("./router/session").session);

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

//function
const log = msg => {
	const logDate = new Date();
	const logD = "[" + logDate.getFullYear().toString().substring(2) + "/" + (logDate.getMonth() + 1).toString().padStart(2,'0') + " " + logDate.getHours().toString().padStart(2,'0') + ":" + logDate.getMinutes().toString().padStart(2,'0') + ":" + logDate.getSeconds().toString().padStart(2,'0') + "]";
	console.log(logD + " " + msg);
}