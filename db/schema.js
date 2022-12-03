const { Pool } = require('pg');
//const { findCount } = require('./controllers.js');
require('dotenv').config()
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PW
});



pool
  .query(`DROP TABLE IF EXISTS questions`)
  .then(() => pool.query(`CREATE TABLE questions (
    question_id INT NOT NULL,
    product_id INT NOT NULL,
    asker_name VARCHAR(50) NOT NULL,
    asker_email VARCHAR(100) NOT NULL,
    question_body TEXT NOT NULL,
    question_date bigint not null,
    question_helpfulness INT DEFAULT 0,
    reported boolean DEFAULT '0'
  )`))
  .then(() => pool.query(`CREATE SEQUENCE IF NOT EXISTS questions_seq START 1 INCREMENT 1 OWNED BY questions.question_id`))
  .then(() => pool.query(`DROP TABLE IF EXISTS answers`))
  .then(() => pool.query(`CREATE TABLE answers (
    answer_id INT NOT NULL,
    question_id INT NOT NULL,
    answerer_name VARCHAR(50) NOT NULL,
    answerer_email VARCHAR(100) NOT NULL,
    body TEXT NOT NULL,
    date bigint NOT NULL,
    helpfulness INT DEFAULT 0,
    reported boolean DEFAULT '0'
  )`))
  .then(() => pool.query(`CREATE SEQUENCE IF NOT EXISTS answers_seq START 1 INCREMENT 1 OWNED BY answers.answer_id`))
  .then(() => pool.query(`DROP TABLE IF EXISTS photos`))
  .then(() => pool.query(`CREATE TABLE photos(photo_id INT NOT NULL, url TEXT, answer_id INT NOT NULL)`))
  .then(() => pool.query(`CREATE SEQUENCE IF NOT EXISTS photos_seq START 1 INCREMENT 1 OWNED BY photos.photo_id`))
  .then(() => {
    console.log('db tables create completed!');
    return pool.end();
  })
  .then(() => console.log('pool ended!'))
  .catch(err => console.error(err.stack));

