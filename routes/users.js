var express = require('express');
var router = express.Router();
var request = require('request');
var htmlparser = require("htmlparser2");


router.get('/', function(req, res, next) {
 
 request.get('https://ru.wikipedia.org/wiki/%D0%91%D1%83%D0%BB%D0%B0%D0%BA-%D0%91%D0%B0%D0%BB%D0%B0%D1%85%D0%BE%D0%B2%D0%B8%D1%87,_%D0%A1%D1%82%D0%B0%D0%BD%D0%B8%D1%81%D0%BB%D0%B0%D0%B2_%D0%9D%D0%B8%D0%BA%D0%BE%D0%B4%D0%B8%D0%BC%D0%BE%D0%B2%D0%B8%D1%87', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var handler = new htmlparser.DomHandler(function (error, dom) {
          if (error) {
             //[...do something for errors...]
             console.log("parse error");
          }
          else {
            //[...parsing done, do something...]
            var fail = false;
            var domUtils = htmlparser.DomUtils;
            
            //найдём все img в таблице с классом infobox
            dom = domUtils.getElements({ class: "infobox" }, dom, true);
            dom = domUtils.getElementsByTagName("img", dom, true);
            
            if (dom.length == 0) {fail = true;}
            else {
              var maxWidth = 100; // иконки и значки имеют ширину менее 100 пикселов, мы ищем фото, которое должно быть больше
              var nodeNum = 0;
              for(var i = 0; i < dom.length; i++) {
                console.log(dom[i].attribs.width);
                if (Number(dom[i].attribs.width) > maxWidth) {
                    maxWidth = dom[i].width;
                    nodeNum = i;
                }
              }
            }
            if (nodeNum == 0) {fail = true;}
            
            console.log(dom[nodeNum].attribs);
          }
        });
        var parser = new htmlparser.Parser(handler);
        parser.write(body);
        parser.done();
    



        res.send("ok");
    }
  });
});

module.exports = router;
