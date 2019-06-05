const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const session = req.session.name;
  res.render('index', { title: 'Express' });
  // if (!session) {
  //   res.send('<script>window.location=/users/login</script>');
  // }
  // else { 
  //   res.render('index', { title: 'Express' }) 
  // };
});

module.exports = router;
