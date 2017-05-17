var express = require('express');
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var router = express.Router();
oracledb.autoCommit = true;

var log = {};
var result = 0;
var check = false;

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', check	: check });
});



router.post('/', function(req, res, next){
    var
        user_id = req.body.log_id,
        user_pw = req.body.log_pw;

    if(log.id == user_id){
    }

    if( (log.id == user_id) && (log.pw == user_pw)) {
        console.log("<login>\n"+"SUCCESSS!\n");
        res.render('index', { title: 'Express', check : 'true' });
    }
    else{
        console.log("<login>\n"+"FAIL!\n");
        res.render('home/login');
    }
});

module.exports = router;
