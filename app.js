

var express = require('express'),
  config = require('./config/config');

var app = express();

require('./config/express')(app, config);
//app.use('public/img'express.static(__dirname + '/public/img'));
app.get('/',function(req,res){
  res.sendFile(path.resolve('public/index.html'));
});
app.get('/public/img',function(req,res){
  res.sendFile(path.resolve('public/img'));
});
app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});
