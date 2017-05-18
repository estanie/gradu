var express = require('express');
var fs = require('fs');
//var multiparty = require('multiparty');
var app = express();
var router = express.Router();

router.get('/main', function(req, res, next) {
  res.render('content/main', { title: 'Express' });
});


module.exports = router;