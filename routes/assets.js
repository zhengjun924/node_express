const fs = require('fs');
const express = require('express');
const formidable = require('formidable');

const router = express.Router();
const form = new formidable.IncomingForm();
form.uploadDir = 'public/images/carousel';
form.keepExtensions = true;
form.multiples = true;

router.get('/img/carouselImg', (req, res) => {
    fs.readFile('public/data/carousel.json', 'utf8', (err, info) => {
        if (err) res.send(err);
        res.send(info)
    })
});

router.post('/img/carousel', (req, res) => {
    form.parse(req, function (err, fields, files) {
        fields.name = files.file.name;
        fields.url = 'zheng/'+files.file.path.replace(/\\/g, "/");

        fs.readFile('public/data/carousel.json', (err, data) => {
            if (err) res.send(errr);
            let carousel = JSON.parse(data.toString());
            fields.id = (carousel.fileList.length - 1) + 1;
            carousel.fileList.push(fields);

            fs.writeFile('public/data/carousel.json', JSON.stringify(carousel, null, 2), (err, info) => {
                if (err) res.send(errr);
                res.send('200')
            });
        });
    });
});

module.exports = router;