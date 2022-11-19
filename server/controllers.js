const pool = require('../db/schema.js');
const Promise = require('bluebird');
module.exports = {
  // addUser: (userArr) => {
  //   const [name, email] = userArr;
  //   return pool.query(`
  //   with id as( SELECT user_id FROM users WHERE user_name='${name}' AND email='${email}'),
  //   i as (INSERT INTO users(user_name, email) SELECT '${name}','${email}' WHERE NOT EXISTS (SELECT 1 FROM id) returning user_Id)
  //   SELECT user_id FROM id UNION ALL SELECT user_id FROM i`)
  //     .then((result) => {
  //       return result.rows[0].user_id;
  //     })
  //     .catch(err => console.error('insert new user err: ', err.stack));
  // },
  getAnswers: (req, res) => {
    const question_id = req.params.question_id;
    const count = !req.params.count ? 5 : req.params.count;
    const page = !req.params.page ? 1 : req.params.page;
    let answers = {question: question_id, page: page, count: count};
    return pool.query(`SELECT json_build_object(
      'answer_id', json_agg(answers.answer_id),
      'body', json_agg(answers.body),
      'date', json_agg(answers.date),
      'answerer_name', json_agg(answers.answerer_name),
      'helpfulness', json_agg(answers.helpfulness)
      ) FROM answers WHERE answers.question_id=${question_id} LIMIT ${count}`)
      .then((result) => {
        console.log(result.rows[0].json_build_object);
        let resultObj = result.rows[0].json_build_object;
        let rowObj = [];
        for(let i = 0; i < count; i++) {
          let obj = {
            'answer_id':resultObj.answer_id[i],
            'body': resultObj.body[i],
            'date': new Date(parseInt(resultObj.date[i])).toISOString(),
            'answerer_name': resultObj.answerer_name[i],
            'helpfulness': resultObj.helpfulness[i]
          }
          rowObj.push(obj);
        }
        answers.results = rowObj;
        console.log(answers);
        res.status(200).json(answers);
      })
      .catch(err => console.error('getAnswer erL:', err));

  },

  getQuestions: (req, res) => {
    const product_id = req.params.product_id;
    const count = req.params.count;
    if (!count) {
      count = 1;
    }
    let results = {product_id: product_id};
    let promises = [];
    return pool.query(`SELECT * FROM questions WHERE product_id=${product_id} LIMIT ${count}`)
      .then((result) => {
        console.log('get result from quesionts')
        results.results = result.rows;
        return result.rows.forEach(row => {
          getAnswers(row);
        })
      })
      .then((data) => console.log(data))
      .catch(err => res.status(404).json(err));
    // if (promises.length === count) {
    //   cosnole.log('length enough!');
    //   Promise.all(promises)
    //     .then((result) => {
    //       console.log('promise all: ', result)
    //       res.status(200).json(result);
    //     })
    //     .catch(err => console.log('err in promise all', err));
    // }
  },



  // addQuestion: (question) => {
  //   //console.log('questions', question);
  //   return pool.query(`INSERT INTO questions VALUES(nextval('questions_seq'), $1, $2, $3, $4, $5, $6)`, question)
  //     .catch(err => console.error('insert new question err: ', err.stack));
  // },

  // addAnswer: (answer) => {
  //   return pool.query(`INSERT INTO answers VALUEWS(nextval('answers_seq))`)
  // }
}