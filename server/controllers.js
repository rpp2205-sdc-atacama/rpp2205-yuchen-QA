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

//   SELECT row_to_json(j) FROM (
//     SELECT a.answer_id, a.body, a.date, a.answerer_name, a.helpfulness, ALL(json_agg(json_build_object('id',p.photo_id,'url',p.url))) AS obj
//     FROM answers a
//     JOIN photos p ON p.answer_id=a.answer_id WHERE a.question_id=1
//     GROUP BY a.answer_id, a.body, a.date, a.answerer_name,a.helpfulness, p.photo_id LIMIT 5) j;

//   SELECT json_build_object(
//       'answer_id', answers.answer_id,
//       'body', answers.body,
//       'date', answers.date,
//       'answerer_name', answers.answerer_name,
//       'helpfulness', answers.helpfulness,
//       'photo', photos
//   ) results FROM answers
//   LEFT JOIN(
//     SELECT answer_id, json_agg(
//       json_build_object(
//         'id', photos.photo_id,
//         'url', photos.url
//       )
//     ) photos FROM photos GROUP BY 1
//   ) photos ON answers.answer_id=photos.answer_id;

//   WITH photos AS (
//     SELECT answer_id, json_agg(
//       json_build_object(
//         'id', p.photo_id,
//         'url', p.url
//       )
//     ) photos
//     FROM photos p
//     GROUP BY 1
//   )
//   SELECT json_build_object(
//     'answer_id', answers.answer_id,
//     'body', answers.body,
//     'date', answers.date,
//     'answerer_name', answers.answerer_name,
//     'helpfulness', answers.helpfulness,
//     'photos', photos
// ) results FROM answers

  getAnswers: (req, res) => {
    const question_id = req.params.question_id;
    const count = !req.params.count ? 5 : req.params.count;
    const page = !req.params.page ? 1 : req.params.page;
    let answers = {question: question_id, page: page, count: count};
    return pool.query(`SELECT json_build_object(
          'answer_id', answers.answer_id,
          'body', answers.body,
          'date', answers.date,
          'answerer_name', answers.answerer_name,
          'helpfulness', answers.helpfulness,
          'photos', photos
  ) FROM answers
  LEFT JOIN(
    SELECT answer_id, json_agg(
      json_build_object(
        'id', photos.photo_id,
        'url', photos.url
      )
    ) photos FROM photos GROUP BY 1
  ) photos ON answers.answer_id=photos.answer_id WHERE answers.question_id=${question_id} LIMIT ${count}`)
      .then((result) => {
        //console.log(result.rows[0].json_build_object);
        answers.results = result.rows[0].json_build_object;
        console.log('return answers: ', answers);
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