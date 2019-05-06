const express = require('express');
const crypto = require('crypto');
const mysql = require('../service/service');

const router = express.Router();

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
router.post('/register/user', (req, res) => {
    if (req.query.name && req.query.name != '') {
        let name = req.query.name;
        selcetSql('name', name, res);
    }else{
        res.sendStatus(404);
    }
});

/* 手机号 */
router.post('/register/phone', (req, res) => {
    if (req.query.phone && req.query.phone != '') {
        let phone = req.query.phone;
        selcetSql('phone', phone, res);
    }else{
        res.sendStatus(404);
    }
});

/* email */
router.post('/register/email', (req, res) => {
    if (req.query.email && req.query.email != '') {
        let email = req.query.email.toString();
        selcetSql('email', email, res);
    }else{
        res.sendStatus(404);
    }
});

/*注册 */
router.post('/register', (req, res) => {
    res.sendStatus(404);
    if (req.query.name != '' && req.query.password != '' && req.query.phone != '' && req.query.email != '') {
        let name = req.query.name;
        let password = crypto.createHash('md5').update(req.query.password).digest('hex');
        let phone = req.query.phone;
        let email = req.query.email.toString();
        let sql = `SELECT * FROM userinfo WHERE name='${name}' AND phone='${phone}' AND email='${email}'`;
        mysql.query(sql, (err, result, fileds) => {
            if (result == '') {
                let sql = `INSERT INTO userinfo (name,password,phone,email) VALUES(${name},${password},${phone},${email})`;
                mysql.query(sql, (err, result) => {
                    console.log(err)
                    if (!err) {
                        res.sendStatus(200);
                    }
                });
            } else {
                res.send('注册失败');
            }
        });
    }
});

/* 登录 */
router.post('/login', (req, res) => {
    if (req.query != '') {
        let name = req.query.name;
        let password = crypto.createHash('md5').update(req.query.password).digest('hex');
        let sql = `SELECT * FROM WHERE name='${name} AND password='${password}'`;
        mysql.query(sql, (err, result) => {
            if (!err) {
                res.sendStatus(200);
            }
        });
    }else{
        res.sendStatus(404);
    }
});

module.exports = router;