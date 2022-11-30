const pool = require('./originSchema.js');

const findCount = (table) => {
  return pool.query(`SELECT count(*) FROM ${table}`)
    .then((result) => {
      console.log('count: ', result.rows[0].count);
      pool.query(`SELECT setval('questions_seq', '${result.rows[0].count}')`)
    })
    .catch(err => console.error('findcount err: ', err.stack));
};

pool
  .query(`CREATE TABLE IF NOT EXISTS temp (
    question_id INT NOT NULL,
    product_id INT NOT NULL,
    asker_id INT,
    question_body TEXT NOT NULL,
    asker_name VARCHAR(50) NOT NULL,
    asker_email VARCHAR(100) NOT NULL,
    question_date VARCHAR(100) NOT NULL,
    question_helpfulness INT,
    reported boolean
  )`)
  .then(() => pool.query(`COPY temp(question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
  FROM '/Users/rain/hackreactor/dataFiles/questions.csv' DELIMITER ',' CSV HEADER`))
  .then((res) => {
    console.log('Questions temp',res.command, res.rowCount);
    return pool.query(`INSERT INTO users(user_name, email) SELECT DISTINCT asker_name, asker_email FROM temp`);
  })
  .then((res) => {
    console.log('users table', res.command, res.rowCount);
    return pool.query(`UPDATE temp SET asker_id=users.user_id FROM users WHERE temp.asker_name=users.user_name AND temp.asker_email=users.email`)
  })
  .then((res) => {
    console.log('Questions temp', res.command, res.rowCount);
    return pool.query(`INSERT INTO questions(question_id, product_id, asker_id, question_body, question_date, question_helpfulness, reported)
    SELECT question_id, product_id, asker_id, question_body, question_date, question_helpfulness, reported FROM temp`)
  })
  .then((res) => {
    console.log('questions', res.command, res.rowCount);
    return pool.query('DROP TABLE temp')
  })
  .then(() => findCount('questions'))
  .then(() => {
    console.log('questions table setuped!')
    return pool.query(`CREATE TABLE IF NOT EXISTS temp (
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
  .then(() => pool.query(`COPY temp(answer_id, question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
  FROM '/Users/rain/hackreactor/dataFiles/answers.csv' DELIMITER ',' CSV HEADER`))
  .then((res) =>{
    console.log('Answer temp', res.command, res.rowCount);
    return pool.query(`INSERT INTO users(user_name, email) SELECT DISTINCT answerer_name, answerer_email FROM temp`);
  })
  .then((res) => {
    console.log('users ', res.command, res.rowCount);
    return pool.query(`UPDATE temp SET answerer_id=users.user_id FROM users WHERE temp.answerer_name=users.user_name AND temp.answerer_email=users.email`)
  })
  .then((res) => {
    console.log('Answer temp', res.command, res.rowCount);
    return pool.query(`INSERT INTO answers(answer_id, question_id, answerer_id, body, date, helpfulness, reported)
    SELECT answer_id, question_id, answerer_id, body, date, helpfulness, reported FROM temp`)
  })
  .then((res) => {
    console.log('answers ', res.command, res.rowCount);
    pool.query('DROP TABLE temp')
  })
  .then(() => findCount('answers'))
  .then(() => {
    console.log('answers table setuped!');
    return pool.query(`COPY photos(photo_id, answer_id, url) FROM '/Users/rain/hackreactor/dataFiles/answers_photos.csv' DELIMITER ',' CSV HEADER`);
  })
  .then((res) => {
    console.log('photos ', res.command, res.rowCount)
    findCount('photos');
  })
  .then(() => console.log('photos table setuped!'))
  .catch(err => console.error('Import Data Err:', err.stack))


