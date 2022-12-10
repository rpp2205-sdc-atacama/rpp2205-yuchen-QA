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

client.query(`DELETE FROM questions WHERE asker_name='k6-tester'`)
.then((res) => {
  console.log('delete',res.rowCount);
  return client.query(`DELETE FROM answers WHERE answerer_name='k6-tester'`);
})
.then((res) => {
  console.log('delte answers', res.rowCount);
  client.end();
})
.then(() => console.log('completed delete test data'))
.catch(err => console.error('delete test data', err.stack))