//http://stackoverflow.com/questions/9548074/nodejs-how-to-add-image-data-from-file-into-canvas

var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');


/* GET users listing. */
router.get('/', function(req, res, next) {
 
 request.get('https://ru.wikipedia.org/wiki/%D0%91%D1%83%D0%BB%D0%B0%D0%BA-%D0%91%D0%B0%D0%BB%D0%B0%D1%85%D0%BE%D0%B2%D0%B8%D1%87,_%D0%A1%D1%82%D0%B0%D0%BD%D0%B8%D1%81%D0%BB%D0%B0%D0%B2_%D0%9D%D0%B8%D0%BA%D0%BE%D0%B4%D0%B8%D0%BC%D0%BE%D0%B2%D0%B8%D1%87', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var imgSrc = body.substring(body.indexOf("infobox", 0));
        imgSrc = imgSrc.substring(imgSrc.indexOf("src=", 0));
        imgSrc = imgSrc.substring(5, imgSrc.indexOf("\"", 7));

        //request.get('https:' + imgSrc, function (error, response, body) {
        request('https:' + imgSrc).pipe(fs.createWriteStream('doodle.jpg'));
        /*
        fs.readFile('app.js', function(err, data) {
            if (err) throw err;
            console.log(data);
            
            
            var Canvas = require('canvas')
            , Image = new Canvas.Image
            , canvas = new Canvas(200, 200)
            , ctx = canvas.getContext('2d');

            Image.src = data;
        
            ctx.drawImage(Image, 0, 0, 50, 50);
            
            
            res.send('OK');
            //res.send('<img src="' + canvas.toDataURL() + '" />');
          });  */
      res.send('OK');
    }
  });
});

module.exports = router;
