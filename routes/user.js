const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('../service/service');

const router = express.Router();

function selcetSql(name, param, res) {
    if (param) {
        const sql = `SELECT * FROM userinfo WHERE ${name}='${param}'`;
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
        const userName = req.body.userName;
        selcetSql('name', userName, res);
    } else {
        res.send('');
    }
});

/* 手机号 */
router.post('/register/phone', (req, res) => {
    if (req.body.phone && req.body.phone != '') {
        const phone = req.body.phone;
        selcetSql('phone', phone, res);
    } else {
        res.send('');
    }
});

/* email */
router.post('/register/email', (req, res) => {
    if (req.body.email && req.body.email != '') {
        const email = req.body.email.toString();
        selcetSql('email', email, res);
    } else {
        res.send('');
    }
});

/*注册 */
router.post('/register', (req, res) => {
    if (req.body.userName != '' && req.body.password != '' && req.body.phone != '' && req.body.email != '') {
        const name = req.body.userName;
        const password = crypto.createHash('md5').update(req.body.password).digest('hex');
        const phone = req.body.phone;
        const email = req.body.email.toString();
        const sql = `SELECT * FROM userinfo WHERE name='${name}' AND phone='${phone}' AND email='${email}'`;
        mysql.query(sql, (err, result, fileds) => {
            if (result == '') {
                const sql = `INSERT INTO userinfo (name,password,phone,email) VALUES('${name}','${password}','${phone}','${email}')`;
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
    if (req.body.email && req.body.password) {
        const email = req.body.email;
        const token = jwt.sign({ email: email }, 'zheng', {
            expiresIn: 60 * 30  // 半小时过期
        });
        const password = crypto.createHash('md5').update(req.body.password).digest('hex');
        const sql = `SELECT * FROM userinfo WHERE email='${email}'`;
        const tokenSql = `UPDATE userinfo SET token='${token}' WHERE email='${email}'`;
        mysql.query(sql, (err, result) => {
            if (result != '' && !err) {
                const sql = `SELECT * FROM userinfo WHERE email='${email}' AND password='${password}'`;
                mysql.query(sql, (err, result) => {
                    if (result != '' && !err) {
                        res.json({
                            status: 200,
                            token: token,
                            name: email
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
        res.send('登录错误');
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

module.exports = router;