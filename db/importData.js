const pool = require('./schema.js');

const setSeqVal = (table) => {
  return pool.query(`SELECT count(*) FROM ${table}`)
    .then((result) => {
      console.log('count: ', result.rows[0].count);
      pool.query(`SELECT setval('questions_seq', '${result.rows[0].count}')`)
    })
    .catch(err => console.error('findcount err: ', err.stack));
};

pool
  .query(`COPY questions(question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
  FROM '/Users/rain/hackreactor/dataFiles/questions.csv' DELIMITER ',' CSV HEADER`)
  .then((res) => {
    console.log('Questions',res.command, res.rowCount);
    setSeqVal('questions');
  })
  .then(() => {
    console.log('questions data imported!')
    return pool.query(`COPY answers(answer_id, question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
  FROM '/Users/rain/hackreactor/dataFiles/answers.csv' DELIMITER ',' CSV HEADER`)
  })
  .then((res) =>{
    console.log('Answers',res.command, res.rowCount);
    setSeqVal('answers');
  })
  .then(() => {
    console.log('answers data imported!');
    return pool.query(`COPY photos(photo_id, answer_id, url) FROM '/Users/rain/hackreactor/dataFiles/answers_photos.csv' DELIMITER ',' CSV HEADER`);
  })
  .then((res) => {
    console.log('photos ', res.command, res.rowCount)
    setSeqVal('photos');
  })
  .then(() => console.log('photos table setuped!'))
  .catch(err => console.error('Import Data Err:', err.stack))