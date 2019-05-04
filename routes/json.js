const express = require('express');
const router = express.Router();
router.get('/j',(req,res)=>{
    res.json({
        name:'zheng',
        gender:'男'
    });
});

module.exports = router;