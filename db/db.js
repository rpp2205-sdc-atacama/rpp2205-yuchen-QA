const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'yuchen',
  database: 'qa',
  password: '123'
});


pool
  .query(`CREATE TABLE IF NOT EXISTS questions (
    question_id INT NOT NULL,
    product_id INT NOT NULL,
    asker_id INT NOT NULL,
    question_body TEXT,
    question_date timestamp with time zone NOT NULL DEFAULT current_timestamp,
    question_helpfulness INT,
    reported boolean
  )`)
  .then(() => pool.query(`CREATE SEQUENCE IF NOT EXISTS questions_seq START 1 INCREMENT 1 OWNED BY questions.question_id`))
  .then(() => pool .query(`CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      user_name VARCHAR(50),
      email VARCHAR(100)
    )`))
    .then(() => pool.query(`CREATE SEQUENCE IF NOT EXISTS users_seq START 1 INCREMENT 1 OWNED BY users.user_id`))
    .then(() =>  pool.query(`CREATE TABLE IF NOT EXISTS answers (
      answer_id INT NOT NULL,
      question_id INT NOT NULL,
      answerer_id INT NOT NULL,
      body TEXT,
      date timestamp with time zone NOT NULL DEFAULT current_timestamp,
      helpfulness INT,
      reported boolean
    )`))
  .then(() => pool.query(`CREATE SEQUENCE IF NOT EXISTS answers_seq START 1 INCREMENT 1 OWNED BY answers.answer_id`))
  .then(() => pool.query(`CREATE TABLE IF NOT EXISTS photos(
      photo_id INT NOT NULL,
      url TEXT,
      answer_id INT NOT NULL
    )`))
  .then(() => pool.query(`CREATE SEQUENCE IF NOT EXISTS photos_seq START 1 INCREMENT 1 OWNED BY photos.photo_id`))
  .catch(err => console.error(err.stack));


  // module.exports = {
  //   addQues: (dataArr) => {
  //     pool.query(`INSERT INTO VALUES($1, $2,$3,$4.$5,$6,$7)`, dataArr)
  //   }
  // }