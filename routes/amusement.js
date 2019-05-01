var express = require('express');
var reqwest = require('reqwest');
var createError = require('http-errors');
var router = express.Router();
router.get('/movies',(req,res)=>{
    reqwest({
        url: 'http://api.douban.com/v2/movie/subject/1764796',
        method: 'post',
        error: err => {
            createError(404)
        },
        success: function (data) {
            res.json(data);
        }
    })
});

module.exports = router;