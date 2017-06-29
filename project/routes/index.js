var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var multiparty = require('multiparty');
var fs = require('fs');
var dbconfig = require('./dbconfig.js');
var router = express.Router();
var connection = mysql.createConnection(dbconfig);
var mime = require('mime');
let exceldb = require('./exceltodb.js');
let majordb = require('./majortodb.js');

var log = {};
var result = 0;
var check = false;
var name = "admin";
var session_id = null;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { check : check });
});

router.get('/baebu', function(req, res, next) {
  res.render('1baebu');
});

router.get('/junlim', function(req, res, next) {
  res.render('1junlim');
});

router.get('/jang', function(req, res, next) {
  res.render('1jang');
});

router.get('/hosil', function(req, res, next) {
  res.render('1hosil');
});

router.get('/buseo', function(req, res, next) {
  res.render('1buseo');
});

router.get('/pyeojun', function(req, res, next) {
  res.render('1pyeojun');
});

router.get('/bonbu', function(req, res, next) {
  res.render('1bonbu');
});

router.get('/jaehak', function(req, res, next) {
  res.render('1jaehak');
});

router.get('/hakbu', function(req, res, next) {
  res.render('1hakbu');
});

router.get('/hakgua', function(req, res, next) {
  res.render('1hakgua');
});

router.get('/kyojik', function(req, res, next) {
  res.render('1kyojik');
});

router.get('/jasan', function(req, res, next) {
  res.render('1jasan');
});

router.get('/haksang', function(req, res, next) {
  res.render('1haksang');
});

router.get('/plus', function(req, res, next) {
  res.render('2plus');
});

router.get('/p_hakbu', function(req, res, next) {
  
  connection.query('select * from hakbu', function(err, rows){
    if (err) {
      console.error("err : " + err);
      res.render('2hakbu',{title : "none", rows : rows, filename : "파일이 존재하지 않습니다.", err : "err"});
    }

    console.log("row 잘 받아옴");
    res.render('2hakbu',{title : "p_hakbu", rows : rows, filename : "학부별 등록금 배분.xlsx", err : "no"});
  });
  
});

router.get('/p_time', function(req, res, next) {
  connection.query('select * from p_time', function(err, rows){
    if (err) {
      console.error("err : " + err);
      res.render('2time',{title : "none", rows : rows, filename : "파일이 존재하지 않습니다.", err : "err"});
    }

    console.log("row 잘 받아옴");
    res.render('2time',{title : "p_time", rows : rows, filename : "시간제 등록금 배분.xlsx", err : "no"});
  });
  
});

router.get('/download/:fileID', function(req, res, next){
  var id = req.params.fileID;
  var re = req.path;

  var back = req.header('Referer') || '/';
  var backArr = back.split("/");
  var go = "/" + backArr[3];
  
  var dir = __dirname;
  dir = dir.replace("routes", "public");
  dir = dir + "/download/" + id + ".xlsx";
  
  if(re  == "/download/none"){
    console.log("파일이 존재하지 않음");
    res.redirect(go);
  }
  else{
    console.log("***dir name : "+  dir + "***");
    console.log("-----------"+ id + " download START-----------")

    res.sendFile(dir, function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("************파일 다운로드!*********");
      }
    });
  }

  /*if(id == "p_hakbu"){
    console.log("-----------"+ id + " download START-----------")
    res.sendFile(dir+"/download/"+id+".xlsx", function(err){
      if(err){
        console.log(err);
        res.status(err.status).end();
      }
      else
        console.log("************파일 다운로드!");
    });

    //res.download('./public/download/'+id + ".xlsx");
    console.log("-----------" + id + " download END -----------");

    /*console.log("-----------"+ id + " download START-----------")
    res.setHeader('Content-disposition', 'attachment; filename=p_hakbu.xlsx');
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.download('./public/upload/'+id + '.xlsx');
    console.log("-----------" + id + " download END -----------");**/
  /*}
  else if(id == "p_time"){
    console.log("-----------"+ id + " download START-----------")
    res.download('./public/download/'+id + ".xlsx");
    console.log("-----------" + id + " download END -----------");    
  }*/
});

router.post('/', function(req, res, next){

    connection.query('select log_id, log_pw from login', function(err, rows) {
      if(err) throw err;
      
      log.id = rows[0].log_id;
      log.pw = rows[0].log_pw;
      
      if(log.id == null || log.pw == null)
        console.log('null return');
      else{ 
        console.log('db에서 잘 받아옴');
        session_id = log.id;
      }
//    console.log("log id : " + log.id + " log_pw : "  + log.pw);
    });

    var
        user_id = req.body.log_id,
        user_pw = req.body.log_pw;

    console.log('user_id : ' + user_id + " user_pw : " + user_pw + " session  : " + session_id);
    
    if( (log.id == user_id) && (log.pw == user_pw) ) {
        console.log("<login>\n"+"SUCCESSS!\n");
        res.render('index', { check : 'true', session_id : session_id });
    }
    else{
        console.log("<login>\n"+"FAIL!\n");
        res.render('home/login', {check : 'false'});
    }
});

router.post('/upload', function(req, res, next) {
      var form = new multiparty.Form();

      // get field name & value
      form.on('field',function(name,value){
           console.log('**원래 파일 / name = '+name+' , value = '+value);
      });

      // file upload handling
      form.on('part',function(part){
           var filename;
           var size;
           if (part.filename) {
                 filename = part.filename;
                 size = part.byteCount;
           }else{
                 part.resume();
           }    

           console.log("Write Streaming file :"+filename);
           var writeStream = fs.createWriteStream('./public/upload/'+filename);
           writeStream.filename = filename;
           part.pipe(writeStream);
 
           part.on('data',function(chunk){
                 console.log(filename+' read '+chunk.length + 'bytes');
           });

           part.on('end',function(){
                 console.log(filename+' Part read complete');
                 writeStream.end();
           });
           
      });

      // all uploads are completed
      form.on('close',function(){
           res.status(200).send('Upload complete');
      });

      // track progress
      form.on('progress',function(byteRead,byteExpected){
           console.log(' Reading total  '+byteRead+'/'+byteExpected);
      });
      form.parse(req);

      //exceldb.dbinput();
      majordb.majorinput();
});

module.exports = router;
