var express = require('express');
var dbconfig = require('./dbconfig.js');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig);
var router = express.Router();

var log = {};
var result = 0;

router.get('/login', function(req, res, next) {

	connection.query('select log_id, log_pw from test', function(err, rows) {
		if(err) throw err;

		log.id = rows[0].log_id;
		log.pw = rows[0].log_pw;

		console.log("log id : " + log.id + " log_pw : "  + log.pw);
		res.render('home/login', {id : log.id, pw : log.pw, result : result});
	});
});

module.exports = router;