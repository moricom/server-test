const redis = require('./redisConnection');

const setUser = (req, res, next) => {
  token = req.cookies.token;
  if (token === undefined) {
    console.log('auth.js: no token');
    console.log(req.cookies);
    return res.send({ massage: 'no token' });
  }
  redis.get(token, (err, user_id) => {
    if (user_id == true) {
      console.log('auth.js: user_id = ' + user_id);
    } else {
      console.log('auth.js: 認証しなおせやぼけ');
      return res.sendStatus(401);
    }
    next();
  });
};

module.exports = setUser;
