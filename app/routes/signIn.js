const express = require('express');
const token = require('crypto-token');
const router = express.Router();

const mysql = require('mysql2/promise');
const mysqlConfig = require('../mysqlConfig');
const redis = require('../redisConnection');

const DB_CONFIG = mysqlConfig.dbName.config;
const USERS_TABLE = mysqlConfig.dbName.tables.users;

router.get('/', (req, res, next) => {
  res.send({ massage: 'hello login' });
});

// ログイン情報がPOSTされたら認証処理に入る
router.post('/', async (req, res, next) => {
  console.log('login.js: hello login.js');
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);
  console.log(email, password);

  let connection;
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    await connection.beginTransaction();
    const query =
      'SELECT user_id FROM ' +
      USERS_TABLE +
      ' WHERE email = ? AND password = ? LIMIT 1';
    const data = [email, password];
    const [result] = await connection.query(query, data);
    await connection.commit();

    if (result.length === 0) {
      // パスワードもしくはメールアドレスが間違っている
      console.log('signIn.up: パスワードかメアドが間違ってます');
      return res.sendStatus(401);
    }

    // クッキーの作成
    const userId = result[0].user_id;
    console.log('login.js: login OK');
    const t = token(32);
    redis.set(t, userId);
    res.cookie('token', t, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      // TODO secure : true
    });
    res.json({ result: t });
  } catch (err) {
    console.log(err);
    await connection.rollback();
    res.send(err);
  } finally {
    connection.end();
    return;
  }
});

module.exports = router;
