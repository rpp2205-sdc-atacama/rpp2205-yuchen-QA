const pool = require('../db/schema.js');
const Promise = require('bluebird');
module.exports = {
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
        ) photos ON answers.answer_id=photos.answer_id
        WHERE answers.question_id=${question_id} LIMIT ${count}`)
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
    const count = !req.params.count ? 5 : req.params.count;
    const page = !req.params.page ? 1 : req.params.page;
    let results = {product_id: product_id};
    let queryStr = `SELECT json_build_object(
      'results', json_agg(
        json_build_object(
          'question_id', q.question_id,
          'question_body', q.question_body,
          'question_date', q.question_date,
          'asker_name', q.asker_name,
          'question_helpfulness', q.question_helpfulness,
          'reported', q.reported,
          'answers', answers
        )
      )
    ) FROM questions q
    LEFT JOIN(
      SELECT question_id, json_object_agg(
        a.answer_id,
        json_build_object(
          'id', a.answer_id,
          'body', a.body,
          'answerer_name', a.answerer_name,
          'helpfulness', a.helpfulness,
          'photos', photos
        )
      )answers FROM answers a
        LEFT JOIN(
          SELECT answer_id, json_agg(
            p.url
          ) photos FROM photos p GROUP BY 1
      ) p ON a.answer_id=p.answer_id
      GROUP BY 1
    )a ON q.question_id=a.question_id
    WHERE q.product_id=${product_id} LIMIT ${count}`;
    //console.log(queryStr);
    return pool.query(queryStr)
      .then((result) => {
        console.log('get result from quesionts');
        console.log('results: ', result.rows[0].json_build_object.results);
        results.result = result.rows[0].json_build_object.results;
        res.status(200).json(results);
      })
      .catch(err => {
        console.log('err, ',err);
        res.status(404).json(err)});

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