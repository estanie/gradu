/**
 * Created by estanie on 2017-06-07.
 */
/**
 * Created by estanie on 2017-05-31.
 */
let xlsx = require('xlsx');
let mysql = require('mysql');
let dbconfig = require('./dbconfig.js');

let connection = mysql.createConnection(dbconfig);

module.exports = {
    majorinput: function () {
        let filename = '전공선택_2015_1학기';
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

        let create = 'create table ' + filename + '( major_class VARCHAR(15), major_id VARCHAR(10),' +
            ' student_id VARCHAR(10),' +
            ' first_major VARCHAR(30) ) default character set utf8mb4 collate utf8mb4_general_ci';
        console.log("create: " + create);
        connection.query(create, function (err) {
            if (err) throw err;
            console.log("create: " + create);
        });

// just header 출력
        /*for (i = 0; i < 7; i++) {
            let cell_address = (ALPHA[i] + '1').toString();
            let Header_cell = worksheet[cell_address];
            let cell_value = Header_cell.v;
        }*/

//나머지 파일들 VLOOKUP 피하려고 그냥 노가다로 적음
        for (i = 2;;i++){
            let end = false;
            let cell_address;
            let cell;
            let cell_value;
            //전공구분
            cell_address = (ALPHA[0]+i).toString();
            cell = worksheet[cell_address];
            if (cell == null) {
                end = true;
            }
            cell_value = (cell == null)?0:cell.v;
            data[0] = cell_value;

            //major_id
            cell_address = (ALPHA[3]+i).toString();
            cell = worksheet[cell_address];

            data[1] = cell_value;
            //student_id

            cell_address = (ALPHA[5]+i).toString();
            cell = worksheet[cell_address];
            cell_value = (cell == null)?0:cell.v;
            data[2] = cell_value;

            //first_major
            cell_address = (ALPHA[10]+i).toString();
            cell = worksheet[cell_address];
            cell_value = (cell == null)?0:cell.v;
            data[3] = cell_value;
            if (end)
                break;
        }
            let ins = 'INSERT INTO ' + filename + ' VALUES (?,?,?,?)';
            ins = mysql.format(ins, data);
            connection.query(ins, function (err) {
                if (err) throw err;
                //console.log(ins + 'excuted');
            });
        }
    }