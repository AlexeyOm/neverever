var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var htmlparser = require('htmlparser2');

var canvasHeight = 249*1.5;
var canvasWidth = 476*1.5;

var tmpImg = '/home/ubuntu/workspace/neverever/doodle.jpg';

router.get('/', function(req, res, next) {
 
  var fail = false;
  request.get(encodeURI('https://ru.wikipedia.org/wiki/w/index.php?search=' + req.query.name), function (error, response, body) {
    if (!error && response.statusCode == 200) {
        
        var imgSrc = '';
        var authorName = '';
        var handler = new htmlparser.DomHandler(function (error, dom) {
          if (error) {
             //[...do something for errors...]
             fail = true;
             console.log("parse error");
          }
          else {
            var domUtils = htmlparser.DomUtils;
            
            //найдём все img в таблице с классом infobox
            dom = domUtils.getElements({ class: "infobox" }, dom, true);
            authorName = domUtils.getElementsByTagName('span', dom, true);
            
            if(authorName.length == 0) {fail = true ;  console.log("failed at authorName.length==0");}
            else {
            
             //если имя стоит в дополнительных тегах, то парсим ниже, если нет, то фэйл, выходим
              try {
                authorName = authorName[0].children[0].data ? authorName[0].children[0].data : authorName[0].children[0].children[0].data;
              }
              catch(err) {
                fail = true;
                console.log(err);
              }
            

              dom = domUtils.getElementsByTagName("img", dom, true);
            
              if (dom.length == 0) {fail = true;  console.log("failed at dom.length==0");}
              else {
                var maxWidth = 100; // иконки и значки имеют ширину менее 100 пикселов, мы ищем фото, которое должно быть больше
                var nodeNum = -1;
                for(var i = 0; i < dom.length; i++) {
                  if (Number(dom[i].attribs.width) > maxWidth) {
                    maxWidth = dom[i].width;
                    nodeNum = i;
                  }
                }
              }
              if (nodeNum == -1) {fail = true; console.log("failed at nodeNum==0");}
              else {
              imgSrc = 'https:' +  dom[nodeNum].attribs.src;
              }
            //console.log(dom[nodeNum].attribs);
            }
          }
        });
        var parser = new htmlparser.Parser(handler);
        parser.write(body);
        parser.done();
        
        console.log("fail = " + fail);
        
        if (fail) {res.send("/images/doodle.jpg");}
        else{
        request(imgSrc)
        .on('error', function(err) {
          console.log(err);
          console.log('не загрузился портрет');
        })
        .pipe(fs.createWriteStream(tmpImg))
        .on('finish', function() {
          fs.readFile(tmpImg, function(err, data) {
          if (err) throw err;
          var Canvas = require('canvas')
            , Image = new Canvas.Image
            , canvas = new Canvas(canvasWidth, canvasHeight)
            , ctx = canvas.getContext('2d');

          Image.src = data;

          ctx.drawImage(Image, canvasWidth/6 - Math.floor(Image.width*canvasHeight/Image.height/2), 0, Math.floor(Image.width*canvasHeight/Image.height), canvasHeight);
          ctx.fillStyle = 'lightgrey';
          ctx.fillRect(canvasWidth/3, 0, canvasWidth, canvasWidth);
          ctx.font = '27px Symbol';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'right';
          var said = req.query.gender == 'f' ? 'говорила' : 'говорил';
          ctx.fillText('Никогда я такого не ' + said , canvasWidth - 30, canvas.height/2);
          ctx.textAlign = 'right';
          ctx.fillText(authorName, canvasWidth - 30, canvasHeight - 80);
          if (fail) res.send('/images/doodle.jpg');
          else res.send(canvas.toDataURL());
      });  
    });
      }
    }
      else {
        res.render('index', { title: 'Такого человека нет'});
      }
    });




  
 

 
});

module.exports = router;
