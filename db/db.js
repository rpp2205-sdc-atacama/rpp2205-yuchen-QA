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
    question_id SERIAL NOT NULL PRIMARY KEY,
    product_id INT NOT NULL,
    asker_id INT,
    question_body TEXT NOT NULL,
    asker_name VARCHAR(50) NOT NULL,
    asker_email VARCHAR(100) NOT NULL,
    question_date VARCHAR(100) NOT NULL,
    question_helpfulness INT,
    reported boolean
  )`)
  .then(() => pool.query(`CREATE SEQUENCE IF NOT EXISTS questions_seq START 1 INCREMENT 1 OWNED BY questions.question_id`))
  .then(() => pool.query(`COPY questions(question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
    FROM '/Users/rain/hackreactor/dataFiles/questions.csv' DELIMITER ',' CSV HEADER`))
  .then((res) => {
     console.log('copy lineL:', res);
     return pool.query(`CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      user_name VARCHAR(50),
      email VARCHAR(100)
    )`)
  })
  .then(() => pool.query(`CREATE SEQUENCE IF NOT EXISTS users_seq START 1 INCREMENT 1 OWNED BY users.user_id`))
  .then(() => pool.query(`INSERT INTO users(user_name, email) SELECT DISTINCT asker_name,asker_email FROM questions`))
  .then((res) => {
    console.log('user: ', res);
    return pool.query(`UPDATE questions SET asker_id=users.user_id FROM users WHERE questions.asker_name=users.user_name AND questions.asker_email=users.email`)
  })
  .then((res) => {
    console.log('update: ', res);
    return pool.query('ALTER TABLE questions DROP COLUMN asker_name, DROP COLUMN asker_email')
  })
  .then(res => {
    console.log('alter done!', res);
  })
  // .then(() =>  pool.query(`CREATE TABLE IF NOT EXISTS answers (
  //     answer_id INT NOT NULL,
  //     question_id INT NOT NULL,
  //     answerer_id INT,
  //     answerer_name VARCHAR(50) NOT NULL,
  //     answerer_email VARCHAR(100) NOT NULL,
  //     body TEXT NOT NULL,
  //     date VARCHAR(100) NOT NULL,
  //     helpfulness INT,
  //     reported boolean
  //   )`))
  // .then(() => pool.query(`CREATE SEQUENCE IF NOT EXISTS answers_seq START 1 INCREMENT 1 OWNED BY answers.answer_id`))
  // .then(() => pool.query(`COPY answers(answer_id, question_id, body, date, answerer_name, answerer_)`))
  // .then(() => pool.query(`CREATE TABLE IF NOT EXISTS photos(
  //     photo_id INT NOT NULL,
  //     url TEXT,
  //     answer_id INT NOT NULL
  //   )`))
  // .then(() => pool.query(`CREATE SEQUENCE IF NOT EXISTS photos_seq START 1 INCREMENT 1 OWNED BY photos.photo_id`))
  .catch(err => console.error(err.stack));


  module.exports = {
    addUser: (userArr) => {
      const [name, email] = userArr;
      return pool.query(`
      with id as( SELECT user_id FROM users WHERE user_name='${name}' AND email='${email}'),
      i as (INSERT INTO users(user_name, email) SELECT '${name}','${email}' WHERE NOT EXISTS (SELECT 1 FROM id) returning user_Id)
      SELECT user_id FROM id UNION ALL SELECT user_id FROM i`)
        .then((result) => {
          return result.rows[0].user_id;
        })
        .catch(err => console.error('insert new user err: ', err.stack));
    },

    addQuestion: (question) => {
      //console.log('questions', question);
      return pool.query('INSERT INTO questions VALUES($1, $2, $3, $4, $5, $6, $7)', question)
        .catch(err => console.error('insert new question err: ', err.stack));
    },

    findCount: (table) => {
      return pool.query(`SELECT count(*) FROM ${table}`)
        .then((result) => {
          console.log('count: ', result.rows[0].count);
          pool.query(`SELECT setval('questions_seq', '${result.rows[0].count}')`)
        })
        .catch(err => console.error('findcount err: ', err.stack));
    }
  }