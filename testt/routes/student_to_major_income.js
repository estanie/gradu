/**
 * Created by estanie on 2017-05-17.
 */
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var express = require('express');
var numRows = 98765431;
var fs = require('fs');
var filename = './plsql/student_cal.sql';
var sql = fs.readFileSync(filename).toString();
oracledb.getConnection(
    {
        user          : dbConfig.user,
        password      : dbConfig.password,
        connectString : dbConfig.connectString
    },
    function(err, connection)
    {
        if (err) {
            console.error(err.message);
            return;
        }


        console.log(sql);
        connection.execute(
            // The statement to execute
            sql,
            // The "bind value" 180 for the "bind variable" :id


            // Optional execute options argument, such as the query result format
            // or whether to get extra metadata
            // { outFormat: oracledb.OBJECT, extendedMetaData: true },

            // The callback function handles the SQL execution results
            function(err, result)
            {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                else {
                    console.log("complete");
                }
//                console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
//                fetchRowsFromRS(connection, result.resultSet, numRows);
            });
    });
function fetchRowsFromRS(connection, resultSet, numRows)
{
    resultSet.getRows(
        numRows,  // get this many rows
        function (err, rows)
        {
            if (err) {
                console.error(err);
                doClose(connection, resultSet); // always close the result set
            } else if (rows.length > 0) {
                console.log("fetchRowsFromRS(): Got " + rows.length + " rows");

                for (var i = 0;i<rows.length;i++) {
                    console.log("id: " + rows[i][0]);
                    console.log("name: "+rows[i][1]);
                }

                if (rows.length === numRows) // might be more rows
                    fetchRowsFromRS(connection, resultSet, numRows);
                else
                    doClose(connection, resultSet); // always close the result set
            } else { // no rows
                doClose(connection, resultSet); // always close the result set
            }
        });
}

function doRelease(connection)
{
    connection.close(
        function(err)
        {
            if (err) { console.error(err.message); }
        });
}

function doClose(connection, resultSet)
{
    resultSet.close(
        function(err)
        {
            if (err) { console.error(err.message); }
            doRelease(connection);
        });
}