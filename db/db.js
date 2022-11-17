const { Pool } = require('pg');
//const { findCount } = require('./controllers.js');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'yuchen',
  database: 'qa',
  password: '123'
});

const findCount = (table) => {
  console.log('start!', table);
  return pool.query(`SELECT count(*) FROM ${table}`)
    .then((result) => {
      console.log('count: ', result.rows[0].count);
      pool.query(`SELECT setval('questions_seq', '${result.rows[0].count}')`)
    })
    .catch(err => console.error('findcount err: ', err.stack));
};

pool
  .query(`CREATE TABLE IF NOT EXISTS questions (
    question_id SERIAL PRIMARY KEY,
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
     console.log('questions ',res.command,': ', res.rowCount);
     findCount('questions')
  })
  .then(() => pool.query(`CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50),
    email VARCHAR(100))`
  ))
  .then(() => pool.query(`INSERT INTO users(user_name, email) SELECT DISTINCT asker_name,asker_email FROM questions`))
  .then((res) => {
    console.log('users ', res.command,': ', res.rowCount);
    return pool.query(`UPDATE questions SET asker_id=users.user_id FROM users WHERE questions.asker_name=users.user_name AND questions.asker_email=users.email`)
  })
  .then((res) => {
    console.log('qustions table', res.command, 'line: ', res.rowCount);
    return pool.query('ALTER TABLE questions DROP COLUMN asker_name, DROP COLUMN asker_email')
  })
  .then(res => {
    console.log(res.command, ' done!');
    return pool.query(`CREATE TABLE IF NOT EXISTS answers (
      answer_id INT NOT NULL,
      question_id INT NOT NULL,
      answerer_id INT,
      answerer_name VARCHAR(50) NOT NULL,
      answerer_email VARCHAR(100) NOT NULL,
      body TEXT NOT NULL,
      date VARCHAR(100) NOT NULL,
      helpfulness INT,
      reported boolean
    )`)
  })
  .then(() => pool.query(`CREATE SEQUENCE IF NOT EXISTS answers_seq START 1 INCREMENT 1 OWNED BY answers.answer_id`))
  .then(() => pool.query(`COPY answers(answer_id, question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
   FROM '/Users/rain/hackreactor/dataFiles/answers.csv' DELIMITER ',' CSV HEADER`))
  .then((res) => {
    console.log('answers ', res.command, ': ', res.rowCount);
    findCount('answers');
  })
  .then(() => pool.query(`INSERT INTO users(user_name, email) SELECT DISTINCT answerer_name, answerer_email FROM answers`))
  .then((res) => {
    console.log('users ', res.command, ': ', res.rowCount);
    return pool.query(`UPDATE answers SET answerer_id=users.user_id FROM users WHERE answers.answerer_name=users.user_name AND answers.answerer_email=users.email`)
  })
  .then((res) => {
    console.log('Answers', res.command, 'line: ',res.rowCount);
    return pool.query('ALTER TABLE answers DROP COLUMN answerer_name, DROP COLUMN answerer_email')
  })
  .then((res) => {
    console.log('drop table', res.command);
    return pool.query(`CREATE TABLE IF NOT EXISTS photos(photo_id INT NOT NULL, url TEXT, answer_id INT NOT NULL)`)
  })
  .then(() => pool.query(`CREATE SEQUENCE IF NOT EXISTS photos_seq START 1 INCREMENT 1 OWNED BY photos.photo_id`))
  .query(`COPY photos(photo_id, answer_id, url) FROM '/Users/rain/hackreactor/dataFiles/answers_photos.csv' DELIMITER ',' CSV HEADER`)
  .then((res) => {
    console.log('photos ', res.command,': ', res.rowCount)
    findCount('photos');
  })
  .then(() => {
    console.log('data setup completed!');
  })
  .catch(err => console.error(err.stack));

module.exports = pool;
