const fs = require('fs');
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const formidable = require('formidable');
const mysql = require('../service/service');

const router = express.Router();
const form = new formidable.IncomingForm();
form.uploadDir = 'public/images/user';
form.keepExtensions = true;
form.multiples = true;

function selcetSql(name, param, res) {
    if (param) {
        let sql = `SELECT * FROM userinfo WHERE ${name}='${param}'`;
        mysql.query(sql, (err, result, fileds) => {
            if (!err && result == '') {
                res.sendStatus(200);
            } else if (result != '') {
                res.send('已存在');
            } else if (err) {
                res.send('发生错误');
            }
        });
    }
}

/* 用户 */
router.post('/register/userName', (req, res) => {
    if (req.body.userName && req.body.userName != '') {
        let userName = req.body.userName;
        selcetSql('name', userName, res);
    } else {
        res.send('');
    }
});

/* 手机号 */
router.post('/register/phone', (req, res) => {
    if (req.body.phone && req.body.phone != '') {
        let phone = req.body.phone;
        selcetSql('phone', phone, res);
    } else {
        res.send('');
    }
});

/* email */
router.post('/register/email', (req, res) => {
    if (req.body.email && req.body.email != '') {
        let email = req.body.email.toString();
        selcetSql('email', email, res);
    } else {
        res.send('');
    }
});

/*注册 */
router.post('/register', (req, res) => {
    if (req.body.userName != '' && req.body.password != '' && req.body.phone != '' && req.body.email != '') {
        let name = req.body.userName;
        let password = crypto.createHash('md5').update(req.body.password).digest('hex');
        let phone = req.body.phone;
        let email = req.body.email.toString();
        let sql = `SELECT * FROM userinfo WHERE name='${name}' AND phone='${phone}' AND email='${email}'`;
        mysql.query(sql, (err, result, fileds) => {
            if (result == '') {
                let sql = `INSERT INTO userinfo (name,password,phone,email) VALUES('${name}','${password}','${phone}','${email}')`;
                mysql.query(sql, (err, result) => {
                    if (!err) {
                        res.sendStatus(200);
                    }
                });
            } else {
                res.send('注册失败');
            }
        });
    } else {
        res.sendStatus(404);
    }
});

/* 登录 */
router.post('/login', (req, res) => {
    if (req.body.userName && req.body.password) {
        let name = req.body.userName;
        let token = jwt.sign({ name: name }, 'zheng', {
            expiresIn: 60 * 30  // 半小时过期
        });
        let password = crypto.createHash('md5').update(req.body.password).digest('hex');
        let sql = `SELECT * FROM userinfo WHERE email='${name}'`;
        let tokenSql = `UPDATE userinfo SET token='${token}' WHERE email='${name}'`;
        mysql.query(sql, (err, result) => {
            if (result != '' && !err) {
                let sql = `SELECT * FROM userinfo WHERE email='${name}' AND password='${password}'`;
                mysql.query(sql, (err, result) => {
                    if (result != '' && !err) {
                        res.json({
                            status: 200,
                            token: token
                        });
                        mysql.query(tokenSql);
                    } else if (result == '') {
                        res.json({
                            status: 400,
                            msg: '密码错误'
                        });
                    } else {
                        res.send(err)
                    }
                })
            } else if (result == '') {
                res.json({
                    status: 400,
                    msg: '该用户还未注册'
                });
            } else {
                res.send(err)
            }
        });
    } else {
        res.sendStatus(404);
    }
});

router.get('/fetchUser', (req, res, next) => {
    const token = req.headers.token;
    jwt.verify(token, 'zheng', function (err, decoded) {
        const name = decoded.name;
        if (err) res.send(err);
        res.json({
            user: name,
            status: 'ok'
        });
        next();
    });
});

/* 获取用户头像 */
router.get('/getHeadSculpture', (req, res) => {
    fs.readFile('public/data/headSculpture.json', (err, data) => {
        if (err) res.send(err);
        res.send(data);
    });
});

/* 提交用户头像 */
router.post('/headSculpture', (req, res) => {
    fs.readdir('public/images/user', (err, data) => {
        data.forEach(item => {
            fs.unlink(`public/images/user/${item}`, err => {
                if (err) res.send(err);
            })
        });
    });

    form.parse(req, (err, fields, files) => {
        let name = files.avatar.name;
        let url = 'zheng/' + files.avatar.path.replace(/\\/g, "/");

        fs.readFile('public/data/headSculpture.json', (err, data) => {
            if (err) res.send(err);
            let imgInfo = JSON.parse(data.toString());
            imgInfo.name = name;
            imgInfo.url = url;

            fs.writeFile('public/data/headSculpture.json', JSON.stringify(imgInfo, null, 2), (err, data) => {
                if (err) res.send(err);
                res.send(data);
            });
        });

    });
});


/* 修改个人信息 */
router.post('/revise', (req, res) => {
    res.send(req.body);
});

module.exports = router;