const pool = require('./db.js');
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
    return pool.query(`INSERT INTO questions VALUES(nextval('questions_seq'), $1, $2, $3, $4, $5, $6)`, question)
      .catch(err => console.error('insert new question err: ', err.stack));
  },

  addAnswer: (answer) => {
    return pool.query(`INSERT INTO answers VALUEWS(nextval('answers_seq))`)
  }
}