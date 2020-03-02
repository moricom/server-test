const redis = require('redis');

const client = redis.createClient({
  host: 'redis',
  port: 6379,
});

client.on('connect', function() {
  console.log('Redisに接続しました');
});

client.on('error', function(err) {
  console.log('次のエラーが発生しました：' + err);
});

module.exports = client;
