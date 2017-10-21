var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var HashMap = require('hashmap');

var http = require('http');
var fs = require('fs');
var baseUrl = "http://nkkumawat.me/";
var keywords = [];
var urls = [];
var tmpStr;
var map = new HashMap();


router.get('/', function(req, res, next) {
    urls.push("index.html");
    map.set("index.html" ,1);
    var fileurl ;
    if(fileurl = urls.pop()) {
        download(baseUrl + fileurl, baseUrl + fileurl, null);
    }
});

var download = function(url, dest, cb) {
    var path = dest.substring(0 , dest.lastIndexOf("/"));
    // console.log(url);
    mkdirp(path, function (err) {
        var file = fs.createWriteStream(dest);
        // console.log(url);
        var request = http.get(url, function(response) {
            response.pipe(file);
            console.log(url);
            file.on('finish', function() {
                fs.readFile(dest, 'utf8', function (err,data) {

                    if (err) {
                        return console.log(err);
                    }
                    keywords = data.split("\n");
                    for(var i = 0 ; i < keywords.length ; i ++ ) {
                        if(keywords[i].includes("src") && !keywords[i].includes("http")) {
                            tmpStr  = keywords[i].match("src=\"(.*)");
                            // console.log(tmpStr);
                            if(tmpStr !== null) {
                                tmpStr = tmpStr[1].split("\"");
                                // console.log(map.get(tmpStr[0]));
                                if(map.get(tmpStr[0]) === undefined){
                                    urls.push( tmpStr[0]);
                                    map.set(tmpStr[0] , 1);
                                }

                            }
                        } else if(keywords[i].includes("href") && !keywords[i].includes("http")) {
                            tmpStr  = keywords[i].match("href=\"(.*)");
                            // console.log(tmpStr);
                            if(tmpStr !== null) {
                                tmpStr = tmpStr[1].split("\"");
                                // console.log(tmpStr[0]);
                                if(map.get(tmpStr[0]) === undefined){
                                    urls.push( tmpStr[0]);
                                    map.set(tmpStr[0] , 1);
                                }
                            }
                        }
                        else if(keywords[i].includes("data") && !keywords[i].includes("http")) {
                            tmpStr  = keywords[i].match("data=\"(.*)");
                            // console.log(tmpStr);
                            if(tmpStr !== null) {
                                tmpStr = tmpStr[1].split("\"");
                                // console.log(tmpStr[0]);
                                if(map.get(tmpStr[0]) === undefined){
                                    urls.push( tmpStr[0]);
                                    map.set(tmpStr[0] , 1);
                                }
                            }
                        }
                    }
                    while(urls.length) {
                        var fileurl = null;
                        console.log("nk");
                        if(fileurl = urls.pop()) {
                            download(baseUrl + fileurl, baseUrl + fileurl, null);
                        }
                    }
                });
            });
        });
    });
};

module.exports = router;
