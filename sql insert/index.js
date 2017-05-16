var express = require('express');
var xlsx = require('xlsx');
var router = express.Router();
var oracledb = require('oracledb');
oracledb.autoCommit = true;

var workbook = xlsx.readFile('testdb.xlsx');

var first_sheet_name = workbook.SheetNames[0];
var worksheet = workbook.Sheets[first_sheet_name];

var ceil = ['A','B','C','D','E','F','G','H','I'];
var insert = new Array();
var end = 108;
var val;

for(var i=2, k=0; i<=end; i++, k++){
	var str = "";
	for(var j=0; j<9; j++){
		val = worksheet[ceil[j]+i];
		val = val ? val.v : 0;
		if(ceil[j]<='D') val = "'"+val+"'";
		str += val;
		if(ceil[j]!='I') str += ",";
	}
	insert[k] = str;
}

for(var i=0; i<=106; i++){
	insert[i] = "insert into test values(" + insert[i] + ")";
}
var k = 0;
oracledb.getConnection(
{
	user          : "db01",
	password      : "ss2",
	connectString : "localhost/orcl"
},
function(err, connection){
	if(err) {console.error(err.message); return; }
	for(var i=0; i<=end-2; i++){
		//console.log(insert[i] + "\n");
		connection.execute(
			insert[i],
			//"insert into test values("+ insert[i] +")",
			[],
			function(err, result){
				if(err) {
					console.error(err.message); return; 
				}
				//console.log("result",result);
			});
		}
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

module.exports = router;