var express = require('express');
var dbconfig = require('./dbconfig.js');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig);
var router = express.Router();

var log = {};
var result = 0;

router.get('/login', function(req, res, next) {

	connection.query('select log_id, log_pw from login', function(err, rows) {
		if(err) throw err;

		log.id = rows[0].log_id;
		log.pw = rows[0].log_pw;

		if(log.id == null || log.pw == null)
			console.log('null return');
		else 
			console.log('db에서 잘 받아옴');
//		console.log("log id : " + log.id + " log_pw : "  + log.pw);
		res.render('home/login', {id : log.id, pw : log.pw});
	});
});

module.exports = router;
