var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: "Twitter in stream with NodeJS, Socket.IO and jQuery" });
});

module.exports = router;
