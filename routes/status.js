const express = require('express');
const router = express.Router();
router.get('/',(req,res)=>{
    // res.sendStatus(200);
    res.status(200).send('请求成功');
    // res.status(200).end();
});

module.exports = router;