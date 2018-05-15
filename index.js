var crypto = require('crypto');
var fs = require('fs');

// read source config
var iosConfigJSON = JSON.parse(fs.readFileSync('./source/STAConfig-ios.txt'));
var androidConfigJSON = JSON.parse(fs.readFileSync('./source/STAConfig-android.txt'));

// make 'target' if not exists
fs.exists('./target',function (exists) {
    if(exists) {
        deleteFolder('./target',function () {
            fs.mkdirSync('./target',function (err) { if(err) throw err; });
        });
    }else{
        fs.mkdirSync('./target',function (err) { if(err) throw err; });
    }
});

// hash .zip packages
var hash = null;
fs.exists('./source/www.zip', function (exists) {
    if(exists){
        hash = crypto.createHash('sha512');
        hash.update(fs.readFileSync('./source/www.zip'));
        var www_hashcode = hash.digest('hex').toUpperCase();
        //set config
        iosConfigJSON.webresources[1].hashcode = www_hashcode;
        androidConfigJSON.webresources[1].hashcode = www_hashcode;
        //copy file to target
        copyfile('./source/www.zip','./target/www.zip');
    }
    makeTargetConfig();
});
fs.exists('./source/www-ios.zip', function (exists) {
    if(exists){
        hash = crypto.createHash('sha512');
        hash.update(fs.readFileSync('./source/www-ios.zip'));
        var ios_hashcode = hash.digest('hex').toUpperCase();
        //set config
        iosConfigJSON.webresources[0].hashcode = ios_hashcode;
        //copy file to target
        copyfile('./source/www-ios.zip','./target/www-ios.zip');
    }
    makeTargetConfig();
});
fs.exists('./source/www-android.zip', function (exists) {
    if(exists){
        hash = crypto.createHash('sha512');
        hash.update(fs.readFileSync('./source/www-android.zip'));
        var android_hashcode = hash.digest('hex').toUpperCase();
        //set config
        androidConfigJSON.webresources[0].hashcode = android_hashcode;
        //copy file to target
        copyfile('./source/www-android.zip','./target/www-android.zip');
    }
    makeTargetConfig();
});

// add config files to 'target'
function makeTargetConfig() {
    fs.writeFileSync('./target/STAConfig-ios.txt',JSON.stringify(iosConfigJSON),function (err) { if(err) throw err; });
    fs.writeFileSync('./target/STAConfig-android.txt',JSON.stringify(androidConfigJSON),function (err) { if(err) throw err; });
}

// delete folder recursively
function deleteFolder(path,callback) {
    var files = fs.readdirSync(path);
    files.forEach(function(file, index) {
        var curPath = path + "/" + file;
        fs.unlinkSync(curPath);
    });
    callback;
};

// copy .zip packages to 'target'
function copyfile(src,dir) {
    fs.writeFileSync(dir,fs.readFileSync(src));
    console.log("******* Hash Successfully ******** : " + src);
}