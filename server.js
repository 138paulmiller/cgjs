var express = require('express');
var app = express();
var path = require('path');
app.use(express.static('public'));

app.get('/',function(req,res){
  res.sendFile(path.resolve('public/index.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 8000!');
});


// Listen on port 8000, IP defaults to 127.0.0.1
app.listen(8000);

console.log("Server running at http://127.0.0.1:8000/");
