/**
 * Created by estanie on 2017-06-07.
 */

let xlsx = require('xlsx');
let mysql = require('mysql');
let dbconfig = require('./dbconfig.js');

let connection = mysql.createConnection(dbconfig);


module.exports = {
    majordivide: function () {
        //1전공이 없는 학생은 없을테니 처음에 1전공이면 insert문 그 외 else 는 alter로 처리

        var exe_query ='call majordiv';
        connection.query(exe_query, function (error, results, fields) {
            if (error) throw error;
        });
    }
}