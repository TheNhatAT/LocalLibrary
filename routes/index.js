var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /** render the template engine view name index.js */
  res.redirect('/catalog');
});

module.exports = router;
