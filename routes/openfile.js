var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');

var canvasHeight = 249*1.5;
var canvasWidth = 476*1.5;

var tmpImg = "/home/ubuntu/workspace/neverever/doodle.jpg";

router.get('/', function(req, res, next) {
 
  request.get(encodeURI('https://ru.wikipedia.org/wiki/' + req.query.name), function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var imgSrc = body.substring(body.indexOf("infobox"));
        var authorName = imgSrc.substring(1+Math.min(imgSrc.indexOf("bold")>0?imgSrc.indexOf("bold"):1000,imgSrc.indexOf("<b>")>0?imgSrc.indexOf("<b>"):1000));
        authorName = authorName.substring(authorName.indexOf(">")+1, authorName.indexOf("<"));
        //authorName = authorName.substring(1, authorName.indexOf("<"));
        imgSrc = imgSrc.substring(imgSrc.indexOf("src=", 0));
        imgSrc = "https:" + imgSrc.substring(5, imgSrc.indexOf("\"", 7));
        //res.render('index', { title: req.query.name, portrait: imgSrc});
        request(imgSrc)
        .on('error', function(err) {
          console.log(err);
        })
        .pipe(fs.createWriteStream(tmpImg))
        .on("finish", function() {
          fs.readFile(tmpImg, function(err, data) {
          if (err) throw err;
          var Canvas = require('canvas')
            , Image = new Canvas.Image
            , canvas = new Canvas(canvasWidth, canvasHeight)
            , ctx = canvas.getContext('2d');

          Image.src = data;

          ctx.drawImage(Image, canvasWidth/6 - Math.floor(Image.width*canvasHeight/Image.height/2), 0, Math.floor(Image.width*canvasHeight/Image.height), canvasHeight);
        
          ctx.fillStyle = "lightgrey";
          ctx.fillRect(canvasWidth/3, 0, canvasWidth, canvasWidth);

          ctx.font = "27px Symbol";
          ctx.fillStyle = "black";
          ctx.textAlign = "right";
          ctx.fillText("Никогда я такого не говорил", canvasWidth - 30, canvas.height/2);
          ctx.textAlign = "right";
          ctx.fillText(authorName, canvasWidth - 30, canvasHeight - 80);

          res.send(canvas.toDataURL());
          //res.send('<img src="' + canvas.toDataURL() + '" />');
        
        
      });  
    });
      }
      else {
        res.render('index', { title: "Такого человека нет"});
      }
    });




  
 

 
});

module.exports = router;
