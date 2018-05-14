var crypto = require('crypto');
var fs = require('fs');

var hash = crypto.createHash('sha512');

fs.readdir('./',function (err1,files) {
    if(!(files.indexOf('source')<0)){
        (files.indexOf('target')<0) ? fs.mkdir('target',function (err2) {
            if(err2) throw err2 || '--- mkdir target failed! ---';
            console.log('*** target ***,mkdir successfully!');
        }): console.log('target folder exists!');
    }else{
        throw '--- source does not exist! ---';
    }
});

var iosConf = fs.readFileSync('./source/STAConfig-ios.txt');
var iosConfigJSON = JSON.parse(iosConf.toString());
var androidConf = fs.readFileSync('./source/STAConfig-android.txt');
var androidConfigJSON = JSON.parse(androidConf.toString());



var www_file = fs.createReadStream('./source/www.zip');
var www_hashcode = null;

www_file.on('data', hash.update.bind(hash));
www_file.on('end', function () {
    www_hashcode = hash.digest('hex').toUpperCase();
    console.log(www_hashcode, typeof www_hashcode, typeof www_file);
    writeWWWConf(www_hashcode);
});

function writeWWWConf(hashcode) {
    iosConfigJSON.webresources[1].hashcode = hashcode;
    fs.writeFile('./target/STAConfig-ios.txt',JSON.stringify(iosConfigJSON),function (err) {
        if(err) {
            throw err;
        }
        console.log("The file was saved! ***** ios *****");
    });

    androidConfigJSON.webresources[1].hashcode = hashcode;
    fs.writeFile('./target/STAConfig-android.txt',JSON.stringify(androidConfigJSON),function (err) {
        if(err) {
            throw err;
        }
        console.log("The file was saved! ***** android *****");
    });
}