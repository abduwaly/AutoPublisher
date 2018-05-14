var crypto = require('crypto');
var fs = require('fs');

var hash = null;

var iosConf = fs.readFileSync('./source/STAConfig-ios.txt');
var iosConfigJSON = JSON.parse(iosConf.toString());
var androidConf = fs.readFileSync('./source/STAConfig-android.txt');
var androidConfigJSON = JSON.parse(androidConf.toString());


// 清空target
fs.exists('./target',function (exists) {
    if(exists) {
        deleteFolder('./target',function () {
            fs.mkdirSync('./target',function (err) { if(err) throw err; });
        });
    }else{
        fs.mkdirSync('./target',function (err) { if(err) throw err; });
    }

});


fs.exists('./source/www.zip', function (exists) {
    if(exists){
        hash = crypto.createHash('sha512');
        hash.update(fs.readFileSync('./source/www.zip'));
        var www_hashcode = hash.digest('hex').toUpperCase();
        //set conf
        iosConfigJSON.webresources[1].hashcode = www_hashcode;
        androidConfigJSON.webresources[1].hashcode = www_hashcode;
        //复制到target
        copyfile('./source/www.zip','./target/www.zip');
    }
    addConfigFile();
});
fs.exists('./source/www-ios.zip', function (exists) {
    if(exists){
        hash = crypto.createHash('sha512');
        hash.update(fs.readFileSync('./source/www-ios.zip'));
        var ios_hashcode = hash.digest('hex').toUpperCase();
        //set conf
        iosConfigJSON.webresources[0].hashcode = ios_hashcode;
        //复制到target
        copyfile('./source/www-ios.zip','./target/www-ios.zip');
    }
    addConfigFile();
});
fs.exists('./source/www-android.zip', function (exists) {
    if(exists){
        hash = crypto.createHash('sha512');
        hash.update(fs.readFileSync('./source/www-android.zip'));
        var android_hashcode = hash.digest('hex').toUpperCase();
        //set conf
        androidConfigJSON.webresources[0].hashcode = android_hashcode;
        //复制到target
        copyfile('./source/www-android.zip','./target/www-android.zip');
    }
    addConfigFile();
});


function addConfigFile() {

    fs.writeFileSync('./target/STAConfig-ios.txt',JSON.stringify(iosConfigJSON),function (err) {
        if(err) { throw err; }
        console.log("The file was saved! ***** ios *****");
    });

    fs.writeFileSync('./target/STAConfig-android.txt',JSON.stringify(androidConfigJSON),function (err) {
        if(err) { throw err; }
        console.log("The file was saved! ***** android *****");
    });
}

function deleteFolder(path,callback) {
    var files = fs.readdirSync(path);
    files.forEach(function(file, index) {
        var curPath = path + "/" + file;
        fs.unlinkSync(curPath);
        console.log(curPath);
    });
    console.log('delete done')
    callback;
};

function copyfile(src,dir) {
    fs.writeFileSync(dir,fs.readFileSync(src));
}
