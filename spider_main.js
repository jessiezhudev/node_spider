var http = require('http');			// http 网路
var cheerio = require("/usr/local/lib/node_modules/cheerio")
var fs = require("fs");	 //流

var queryHref = "http://www.maccosmetics.com.cn/bestsellers"
//目标网址

var urls = [] //待下载图片地址

function getHtml(href) {
  var pageData = "";
  var req = http.get(href, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      pageData += chunk;
    });

    res.on('end', function() {
      var $ = cheerio.load(pageData);
      var html = $(".grid--mpp__item a img");
      console.log(html.length, 'length')
      for(var i = 0; i < html.length; i++) {
        var src = "http://www.maccosmetics.com.cn" + html[i].attribs.src;
        // console.log("src")
        // 筛选部分广告，不是真的段子
          // urls.push(html[i].attribs.src)
          downImg(src)
      }
      // downImg(urls.shift());

    });
  });
}
function downImg(imgurl) {
  console.log(imgurl, "imgurl")
  // var narr = imgurl.replace("http://image.haha.mx/", "").split("/")

  http.get(imgurl, function(res) {
    var imgData = "";
    var narr = imgurl.replace("http://www.maccosmetics.com.cn/", "").split("/")

    //一定要设置response的编码为binary否则会下载下来的图片打不开
    res.setEncoding("binary");

    res.on("data", function(chunk) {
      imgData += chunk;
    });

    res.on("end", function() {
      var savePath = "./pic" + narr[0]  + narr[1] + narr[2] + narr[3] + narr[4] + "_" + narr[5];
      // 保存图片
      fs.writeFileSync(savePath, imgData, "binary", function(err) {
        if(err) {
          console.log(err);
        }
      });
    });
  });
}
function start(){
  console.log("开始获取图片连接");
	getHtml(queryHref);
}
start();
