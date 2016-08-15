

var express = require('express'),
  config = require('./config/config');

var app = express();

require('./config/express')(app, config);

app.get('/',function(req,res){
  res.sendFile(path.resolve('public/index.html'));
});

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});
