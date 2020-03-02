const express = require('express');
const router = express.Router();
const redis = require('../redisConnection');

router.post('/', (req, res) => {
  token = req.cookies.token;
  redis.del(token);
  res.clearCookie('token');
  res.send({ massage: 'signout simasita' });
});

module.exports = router;
