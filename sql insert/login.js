var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();
oracledb.autoCommit = true;

var log = new Array();

oracledb.getConnection(
{
	user          : "db01",
	password      : "ss2",
	connectString : "localhost/orcl"
},
function(err, connection){
	if(err) {console.error(err.message); return; }
	
	connection.execute(
			"select log_id, log_pw AS log FROM login"+
			//"insert into test values("+ insert[i] +")",
			[],
			function(err, result){
				if(err) {
					console.error(err.message); return; 
				}
				console.log("result",result);
			}
	);
});

router.get('/login', function(req, res, next) {
	console.log(log[0] + log[1]);
  	//res.render('login', { id: log[0], pw : log[1]});
});

module.exports = router;