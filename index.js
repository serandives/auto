var mongourl = 'mongodb://localhost/test';

var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect(mongourl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('connected to mongodb : ' + mongourl);
    app.use(require('auth')({
        open: [
            '^(?!\\/apis(\\/|$)).+',
            '^\/apis\/v\/tokens([\/].*|$)',
            '^\/apis\/v\/vehicles$'
        ]
    }));
    app.use('/apis/v', require('user-service'));
    app.use('/apis/v', require('client-service'));
    app.use('/apis/v', require('vehicle-service'));
    app.use('/apis/v', require('token-service'));

    app.use(express.json());
    app.use(express.urlencoded());

    app.listen(4000);
    console.log('listening on port 4000');
});