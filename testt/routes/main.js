var express = require('express');
var fs = require('fs');
//var multiparty = require('multiparty');
var app = express();

var router = express.Router();

/*var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
oracledb.autoCommit = true;

var log = {};
var result = 0;

oracledb.getConnection(
{
	user          : dbConfig.user,
	password      : dbConfig.password,
	connectString : dbConfig.connectString
},
function(err, connection){
	if(err) {console.error(err.message); return; }
	
	connection.execute(
			"select log_id, log_pw from login",
			{},
			function(err, result){
				if(err) {
					console.error(err.message); return; 
				}

				log.id = result.rows[0][0];
				log.pw = result.rows[0][1];

			}
	);
});
*/

router.get('/main', function(req, res, next) {
  res.render('content/main', { title: 'Express' });
});


module.exports = router;