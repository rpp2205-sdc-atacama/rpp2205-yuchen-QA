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


client.query(`CREATE INDEX IF NOT EXISTS product_id_idx ON questions(product_id)`)
  .then(() => client.query(`CREATE INDEX IF NOT EXISTS question_id_idx ON answers(question_id)`))
  .then(() => client.query(`CREATE INDEX IF NOT EXISTS answer_id_idx ON photos(answer_id)`))
  .then(() => client.query(`CREATE INDEX IF NOT EXISTS only_question_idx ON questions(question_id)`))
  .then(() => client.query(`CREATE INDEX IF NOT EXISTS only_answer_idx ON answers(answer_id)`))
  .then(() => client.end())
  .then(() => console.log('finished'))
  .catch(err => console.error('delete test data', err.stack))