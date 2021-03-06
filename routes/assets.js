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
        res.send(info);
    })
});

router.delete('/img/delete', (req, res) => {
    const uid = req.body.uid;
    const url = req.body.url.substring(6);
    fs.readFile('public/data/carousel.json', (err, info) => {
        if (err) res.send(err);

        const data = JSON.parse(info.toString());
        data.fileList = data.fileList.filter((item) => item.uid != uid);

        fs.writeFile('public/data/carousel.json', JSON.stringify(data, null, 2), err => {
            if (err) res.send(err);
            fs.unlink(url, err => {
                if (err) res.send(err);
            });
            res.json({
                msg: '删除成功',
                data: data
            });
        });
    })
})

router.post('/img/carousel', (req, res) => {
    form.parse(req, function (err, fields, files) {
        fields.name = files.file.path.substring(23);
        fields.url = 'zheng/' + files.file.path.replace(/\\/g, "/");

        fs.readFile('public/data/carousel.json', (err, data) => {
            if (err) res.send(errr);
            const carousel = JSON.parse(data.toString());
            fields.uid = (carousel.fileList.length - 1) + 1;
            carousel.fileList.push(fields);

            fs.writeFile('public/data/carousel.json', JSON.stringify(carousel, null, 2), (err, info) => {
                if (err) res.send(errr);
                res.send(carousel)
            });
        });
    });
});

module.exports = router;