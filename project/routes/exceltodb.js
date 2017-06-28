/**
 * Created by estanie on 2017-05-31.
 */
let xlsx = require('xlsx');
let mysql = require('mysql');
let dbconfig = require('./dbconfig.js');

let connection = mysql.createConnection(dbconfig);

console.log(xlsx.version);

module.exports = {
    dbinput: function () {
        let filename = '등록금_2015_1학기';
        let workbook = xlsx.readFile('./public/upload/'+filename +'.xlsx');

        let sheet_name = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[sheet_name];
        const ALPHA = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        let data = [];
//첫 줄 출력

        let drop = 'drop table if exists ' + filename;
        console.log("drop: " + drop);
        connection.query(drop, function (err, rows) {
            if (err) throw err;
            console.log("drop: " + drop);
        });

        let create = 'create table ' + filename + '( 소속 VARCHAR(15), 대학_부서코드 VARCHAR(10),' +
            ' 전공_부서코드 VARCHAR(10), 학번 VARCHAR(10), 입학금 INTEGER,' +
            ' 수업료 INTEGER, 학점등록 VARCHAR(15) ) default character set utf8mb4 collate utf8mb4_general_ci';
        console.log("create: " + create);
        connection.query(create, function (err) {
            if (err) throw err;
            console.log("create: " + create);
        });

// just header 출력
        for (i = 0; i < 7; i++) {
            let cell_address = (ALPHA[i] + '1').toString();
            let Header_cell = worksheet[cell_address];
            let cell_value = Header_cell.v;
        }

//나머지 파일들
        for (i = 2; ; i++) {
            let end = false;
            for (j = 0; j < 7; j++) {
                let cell_address;
                let cell;
                let cell_value;
                cell_address = (ALPHA[j] + i).toString();
                cell = worksheet[cell_address];
                if (j == 0 && cell == null) {
                    end = true;
                    break;
                }
                if (cell == null)
                    cell_value = 0;
                else cell_value = cell.v;
                data[j] = cell_value;
//            console.log(cell_address+' : '+data[j]);
            }
            if (end)
                break;
            let ins = 'INSERT INTO ' + filename + ' VALUES (?,?,?,?,?,?,?)';
            ins = mysql.format(ins, data);
            connection.query(ins, function (err) {
                if (err) throw err;
                //console.log(ins + 'excuted');
            });
        }

    }
}
