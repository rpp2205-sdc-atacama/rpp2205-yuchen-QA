const {Client} = require('pg');
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'yuchen',
  database: 'sdcqa',
  password: '123'
});

client.connect((err) => {
  if (err) {
    console.error('connect error: ', err.stack)
  }
  else {
    console.log('connected!')
  }
})

const setSeqVal = (table) => {
  return client.query(`SELECT count(*) FROM ${table}`)
    .then((result) => {
      console.log('count: ', result.rows[0].count);
      return client.query(`SELECT setval('${table}_seq', '${result.rows[0].count}')`)
    })
    .then((result) => {
      console.log('set', table, 'val to', result.rows[0].setval)
    })
    .catch(err => console.error('findcount err: ', err.stack));
};

client
  .query(`COPY questions(question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
  FROM '/Users/rain/hackreactor/dataFiles/questions.csv' DELIMITER ',' CSV HEADER`)
  .then((res) => {
    console.log('Questions',res.command, res.rowCount);
    setSeqVal('questions');
  })
  .then(() => client.query(`ALTER TABLE questions
    ALTER COLUMN question_date SET DATA TYPE timestamp with time zone USING to_timestamp(question_date/1000)`)
  )
  .then(() =>  {
    console.log('questions data imported!');
    return client.query(`COPY answers(answer_id, question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
    FROM '/Users/rain/hackreactor/dataFiles/answers.csv' DELIMITER ',' CSV HEADER`)
  })
  .then((res) =>{
    console.log('Answers',res.command, res.rowCount);
    return setSeqVal('answers');
  })
  .then(() => client.query(`ALTER TABLE answers
    ALTER COLUMN date SET DATA TYPE timestamp with time zone USING to_timestamp(date/1000)`)
  )
  .then(() => {
    console.log('answers data imported!');
    return client.query(`COPY photos(photo_id, answer_id, url) FROM '/Users/rain/hackreactor/dataFiles/answers_photos.csv' DELIMITER ',' CSV HEADER`);
  })
  .then((res) => {
    console.log('photos ', res.command, res.rowCount)
    return setSeqVal('photos');
  })
  .then(() => {
    console.log('photos table setuped!');
    return client.end();
  })
  .then(() => {console.log('client has ended!')})
  .catch(err => console.error('Import Data Err:', err.stack))