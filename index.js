var crypto = require('crypto');
var fs = require('fs');

var hash = crypto.createHash('sha512');

var www_file = fs.createReadStream('./source/www.zip');
var www_hashcode = null;

www_file.on('data', hash.update.bind(hash));
www_file.on('end', function () {
    www_hashcode = hash.digest('hex');
    console.log(www_hashcode, typeof www_hashcode, typeof www_file);
});

fs.readdir('./',function (err,files) {
    if(!err && !(files.indexOf('source')<0)){
        (files.indexOf('target')<0) ? fs.mkdir('target',function (err) {
            console.log(err || '*** target ***,mkdir successfully!');
        }): function () {
            console.log('target folder exists!');
        };
    }else{
        console.log(err);
    }
});