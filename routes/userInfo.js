const fs = require('fs');
const express = require('express');
const mysql = require('../services/service');
const formidable = require('formidable');

const router = express.Router();
const form = new formidable.IncomingForm();
form.uploadDir = 'public/images/user';
form.keepExtensions = true;
form.multiples = true;

/* 获取用户头像 */
router.get('/getHeadSculpture', (req, res) => {
    if (req.headers.token) {
        const token = req.headers.token;
        const sql = `SELECT headSculptureSrc FROM userinfo WHERE token='${token}'`;
        mysql.query(sql, (err, result, files) => {
            if (result && result != '') {
                const url = result[0].headSculptureSrc;
                res.send(url);
            }
        });
    } else {
        res.json({
            url:'/zheng/public/images/user/empty.png'
        });
    }

});

/* 提交用户头像 */
router.post('/headSculpture', (req, res) => {
    const token = req.headers.token;
    const searchSql = `SELECT headSculptureSrc FROM userinfo WHERE token='${token}'`;
    mysql.query(searchSql, (err, result, files) => {
        if (err) res.send(err);
        const existSrc = result[0].headSculptureSrc.substring(6);

        if (existSrc) {
            fs.unlink(existSrc, err => {
                if (err) res.send(err);
            });
        }

        form.parse(req, (err, fields, files) => {
            if (err) res.send(err)
            const url = 'zheng/' + files.avatar.path.replace(/\\/g, "/");
            const sql = `UPDATE userinfo SET headSculptureSrc='${url}' WHERE token='${token}'`;
            mysql.query(sql, (err, result, fileds) => {
                if (err) res.send(err);
                res.send('ok');
            });
        });
    });

});


/* 修改个人信息 */
router.post('/revise', (req, res) => {
    let token = req.headers.token;
    let name = req.body.userName;
    let email = req.body.email;
    let password = crypto.createHash('md5').update(req.body.password).digest('hex');
    let phone = req.body.phone;
    jwt.verify(token, 'zheng', function (err, decoded) {
        const loginEmail = decoded.name;
        console.log(loginEmail);
        const sql = `UPDATE userinfo SET name='${name}', email='${email}', password='${password}', phone='${phone}' WHERE email='${loginEmail}'`;
        mysql.query(sql, (err, result, fields) => {
            if (err) res.send(err)
            if (!err && result != '') {
                res.json({
                    status: 200,
                    msg: '修改成功'
                });
            }
        })
    });
});

module.exports = router; 