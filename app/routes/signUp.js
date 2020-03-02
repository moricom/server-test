const express = require('express');
const router = express.Router();
const redis = require('../redisConnection');
const mysql = require('mysql2/promise');
const mysqlConfig = require('../mysqlConfig');
const mailer = require('nodemailer');

const DB_CONFIG = mysqlConfig.dbName.config;
const AUTH_TABLE = mysqlConfig.dbName.tables.mail_auth;
const USERS_TABLE = mysqlConfig.dbName.tables.users;

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  console.log('signUp.js: check logged in');
  console.log(token);
  if (typeof token === 'undefined') {
    redis.get(token, (err, user_id) => {
      if (user_id > 0) {
        console.log('signup.js: user_id = ' + user_id);
        return res.send({ massage: 'You are already logged in' });
      }
    });
  }
  next();
};

const existsEmail = async (req, res, next) => {
  const email = req.body.email;
  console.log(`email = ${email}`);
  //メールチェック
  if (email == false) {
    return res.send({ massage: 'メアド入力せんかい' });
  }
  let connection;
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    await connection.beginTransaction();
    const existsQuery =
      'SELECT * FROM ' + USERS_TABLE + ' WHERE email = ? LIMIT 1;';
    const [result] = await connection.query(existsQuery, [email]);
    await connection.commit();
    if (!result.length) {
      // 0件だからおｋ
      next();
    } else {
      console.log(result);
      return res.send('メールアドレス既に登録されてまーす');
    }
  } catch (err) {
    console.log(err);
    await connection.rollback();
    res.send(err);
  } finally {
    connection.end();
    return;
  }
};

const getRandomInt = max => {
  // 0 <= result < max
  return Math.floor(Math.random() * Math.floor(max));
};

router.post('/pre', existsEmail, async (req, res, next) => {
  const email = req.body.email;
  // 認証番号を作成
  let auth_num = '';
  for (let i = 0; i < 6; i++) {
    auth_num += getRandomInt(10);
  }

  let connection;
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    await connection.beginTransaction();

    // 仮登録にメールが存在するかチェック
    const existsQuery = 'SELECT * FROM ' + AUTH_TABLE + ' WHERE email = ?';
    const [result] = await connection.query(existsQuery, [email]);

    // 存在した場合は削除
    if (result.length > 0) {
      console.log('signup.js :仮登録テーブルに存在します。デリート文発行');
      const deleteQuery = 'DELETE FROM ' + AUTH_TABLE + ' WHERE email = ?';
      await connection.query(deleteQuery, [email]);
    }

    // テーブルにメールと認証番号を登録
    const insertQuery = 'INSERT INTO ' + AUTH_TABLE + ' set ?';
    const insertData = {
      email: email,
      number: auth_num,
    };
    await connection.query(insertQuery, insertData);

    await connection.commit();

    // メールを送信する
    const transporter = mailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: 'mori.afse@gmail.com',
        pass: 'afse2019',
      },
    });
    var mailOptions1 = {
      from: '"NodeMailer" <mori.afse@gmail.com>',
      to: email,
      subject: '件名',
      text: 'test',
      html: `<h1>仮登録中</h1><h2>認証番号は ${auth_num}</h2>`, // html body
    };
    transporter.sendMail(mailOptions1, function(error, info) {
      if (error) {
        console.error(error);
        return res.send('仮登録メールを送れませんでした');
      }
      console.log('Email sent: ' + info.response);
      res.send(`send auth number to ${email}`);
    });
  } catch (err) {
    console.error(err);
    await connection.rollback();
    res.send(err);
  } finally {
    connection.end();
    // return;
  }
});

router.post('/auth', isLoggedIn, existsEmail, async (req, res, next) => {
  //認証用番号のチェック
  //TODO 既に登録されてないか
  const email = req.body.email;
  const authNumber = req.body.authNumber;
  console.log(`auth : email ${email} num ${authNumber}`);
  let connection;
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    await connection.beginTransaction();

    // 認証用番号の正当性を確認
    const authQuery =
      'SELECT * FROM ' + AUTH_TABLE + ' WHERE email = ? AND number = ?;';
    const authData = [email, authNumber];
    const [resultAuth] = await connection.query(authQuery, authData);
    if (!resultAuth.length) {
      console.log('signup.js: 番号もしくはメールアドレスが不正です');
      console.log(resultAuth);
      return res.send('番号かメアド間違えてまーす');
    }

    // 認証用番号の期限確認
    const expQuery =
      'SELECT email FROM ' +
      AUTH_TABLE +
      ' WHERE email = ?  AND (create_at > CURRENT_TIMESTAMP + INTERVAL - 10 MINUTE)';
    // SELECT email FROM mail_auth WHERE create_at > CURRENT_TIMESTAMP + INTERVAL - 10 MINUTE;
    const [resultEXP] = await connection.query(expQuery, [email]);
    if (!resultEXP.length) {
      console.log('signup.js: 番号の期限か切れています');
      console.log(resultEXP);
      return res.send('期限がきれてまーす');
    }

    // メール認証済み
    const updateQuery = 'UPDATE ' + AUTH_TABLE + ' SET ? WHERE email = ?';
    const updateData = [{ is_authenticated: true }, email];
    await connection.query(updateQuery, updateData);

    await connection.commit();

    res.send('認証完了');
  } catch (err) {
    console.log(err);
    await connection.rollback();
    res.send(err);
  } finally {
    connection.end();
    // return;
  }
});

router.post(
  '/registration',
  isLoggedIn,
  existsEmail,
  async (req, res, next) => {
    //本登録
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name ? req.body.name : 'NoNameMan';

    let connection;
    try {
      connection = await mysql.createConnection(DB_CONFIG);
      await connection.beginTransaction();

      const authCheckQuery =
        'select is_authenticated from ' + AUTH_TABLE + ' WHERE email = ?';
      const [authResult] = await connection.query(authCheckQuery, [email]);
      console.log(authResult);
      if (!authResult.length) {
        return res.send('メール仮登録されてないぞ');
      } else {
        console.log(authResult.is_authenticated);
        for (const result of authResult) {
          if (result.is_authenticated == false) {
            return res.send('いやちゃんと番号登録しようか');
          }
        }
      }

      const insertQuery = 'INSERT INTO ' + USERS_TABLE + ' set ?';
      const insertData = {
        name: name,
        email: email,
        password: password,
      };

      await connection.query(insertQuery, insertData);

      const deleteQuery = 'DELETE FROM ' + AUTH_TABLE + ' WHERE email = ?';
      await connection.query(deleteQuery, [email]);

      connection.commit();

      res.send('本登録しました');
    } catch (err) {
      console.log(err);
      await connection.rollback();
      res.send(err);
    } finally {
      connection.end();
      return;
    }
  }
);

module.exports = router;
