const express = require('express');
const app = express();

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/name', (req, res) => {
	console.log('get name')
	res.end('Tom')
})

app.listen(4000);

