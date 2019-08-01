const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('../services/service');

const router = express.Router();

function selcetSql(name, param, res) {
    if (param) {
        const sql = `SELECT * FROM userinfo WHERE ${name}='${param}'`;
        mysql.query(sql, (err, result, fileds) => {
            if (!err && result.length === 0) {
                res.json({
                    msg: 'ok'
                });
            } else if (result.length > 0) {
                res.json({
                    msg: '已存在',
                });
            } else if (err) {
                res.json({
                    msg: '发生错误',
                });
            }
        });
    }
}

/* 用户 */
router.post('/register/userName', (req, res) => {
    const { body: { userName } } = req;
    if (userName && userName !== '') {
        selcetSql('name', userName, res);
    }
});

/* email */
router.post('/register/email', (req, res) => {
    const { body: { email } } = req;
    if (email && email !== '') {
        selcetSql('email', email, res);
    } else {
        res.send('');
    }
});

/* 手机号 */
router.post('/register/phone', (req, res) => {
    const { body: { phone } } = req;
    if (phone && phone != '') {
        selcetSql('phone', phone, res);
    } else {
        res.send('');
    }
});

/*注册 */
router.post('/register', (req, res) => {
    let { body: { userName, password, phone, email, } } = req;
    if (userName !== '' && password !== '' && phone !== '' && email !== '') {
        const password = crypto.createHash('md5').update(req.body.password).digest('hex');
        const sql = `SELECT * FROM userinfo WHERE name='${name}' AND phone='${phone}' AND email='${email}'`;
        mysql.query(sql, (err, result, fileds) => {
            if (result.length === 0) {
                const sql = `INSERT INTO userinfo (name,password,phone,email) VALUES('${name}','${password}','${phone}','${email}')`;
                mysql.query(sql, (err, result) => {
                    if (!err) {
                        res.josn({
                            msg: '注册成功'
                        });
                    }
                });
            } else {
                res.josn({
                    msg: '注册失败'
                });
            }
        });
    } else {
        res.sendStatus(404);
    }
});

/* 登录 */
router.post('/login', (req, res) => {
    let { body: { email, password } } = req;
    if (email && password) {
        const token = jwt.sign({ email: email }, 'zheng', {
            expiresIn: 60 * 30  // 半小时过期
        });
        const password = crypto.createHash('md5').update(req.body.password).digest('hex');
        const sql = `SELECT * FROM userinfo WHERE email='${email}'`;
        mysql.query(sql, (err, result) => {
            if (!err && result.length === 0) {
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
            } else if (result.length === 0) {
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
    const { headers: { token } } = req;
    jwt.verify(token, 'zheng', function (err, decoded) {
        const { name } = decoded;
        if (err) res.send(err);
        res.json({
            user: name,
            status: 'ok'
        });
        next();
    });
});

module.exports = router;