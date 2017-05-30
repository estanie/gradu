/**
 * Created by estanie on 2017-05-31.
 */
let xlsx = require('xlsx');
let mysql = require('mysql');
let dbconfig = require('./dbconfig.js');
let connection = mysql.createConnection(dbconfig);

let filename = '등록금_2015_1학기';
let workbook = xlsx.readFile('../public/upload/'+filename +'.xlsx');

let sheet_name = workbook.SheetNames[0];
let worksheet = workbook.Sheets[sheet_name];
const ALPHA = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
let data = [];

//첫 줄 출력
let sql = 'drop table if exists '+filename;
connection.query(sql, function(err,rows){
    if(err) throw err;
    console.log("기존 table 삭제!");
});

sql = 'create table '+filename+'( 소속 VARCHAR(15), 대학_부서코드 VARCHAR(10),' +
    ' 전공_부서코드 VARCHAR(10), 학번 VARCHAR(10), 입학금 INTEGER,' +
    ' 수업료 INTEGER, 학점등록 VARCHAR(15) );';

connection.query(sql, function(err){
    if(err) throw err;
    console.log("table 생성!");
});

// just header 출력
for (i = 0;i<7;i++){
    let cell_address = (ALPHA[i]+'1').toString();
    let Header_cell = worksheet[cell_address];
    let cell_value = Header_cell.v;
}

//나머지 파일들
for (i = 2;;i++){
    let end = false;
    {
        for (j = 0;j<7;j++){
            let cell_address;
            let cell;
            let cell_value;
            cell_address = (ALPHA[j]+i).toString();
            cell = worksheet[cell_address];
            if (j == 0&&cell == null) {
                end = true;
                break;
            }
            if (cell == null)
                cell_value = 0;
            else cell_value = cell.v;
            data[j] = cell_value;
//            console.log(cell_address+' : '+data[j]);
        }
    }
    if (end)
        break;
    sql = 'INSERT INTO '+ filename + ' VALUES (?,?,?,?,?,?,?)';
    sql = mysql.format(sql,data);
    //console.log(sql);
    connection.query(sql,function(err){if(err) throw err;});
}

connection.destroy();