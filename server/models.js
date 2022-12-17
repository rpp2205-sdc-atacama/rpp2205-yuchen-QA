const {Client} = require('pg');
require('dotenv').config()
const client = new Client({
  host: '3.145.145.23',
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

module.exports = {
  getAnswers: (answers) => {
    let offset = (answers.page-1) * answers.count;
    console.log(answers);
    let queryStr = `SELECT
      answer_id,
      body,
      date,
      answerer_name,
      helpfulness,
      (SELECT
        COALESCE(json_agg(photo_list), '[]')
      FROM
        (SELECT
          photos.photo_id AS id,
          photos.url
        FROM photos
        WHERE photos.answer_id=answers.answer_id) AS photo_list
      ) AS photos
      FROM answers WHERE question_id=${answers.question}
      AND reported='0'
      LIMIT ${answers.count} OFFSET ${offset}`;

    return client.query(queryStr)
      .then((result) => {
        //console.log(result.rows[0]);
        answers.results = result.rows
        return answers;
      })
      .catch(err => {
        console.error('get answers', err)
        throw err;
      });
  },

  getQuestions: (product_id,count,page,results) => {
    let offset = (page - 1) * count;
    let queryStr3 = `SELECT
      question_id,
      question_body,
      question_date,
      asker_name,
      question_helpfulness,
      reported,
      (SELECT
          COALESCE (json_object_agg(key, value), '{}')
        FROM
          (SELECT
            answer_list.id AS key,
            to_jsonb(answer_list) AS value
          FROM
            (SELECT
              answers.answer_id AS id,
              answers.body,
              answers.date,
              answers.answerer_name,
              answers.helpfulness,
              (SELECT
                coalesce(array_agg(photo_list.url), '{}')
              FROM (
                SELECT
                  photos.url
                FROM photos
                WHERE photos.answer_id=answers.answer_id) AS photo_list
              )AS photos
            FROM answers
            WHERE answers.question_id = questions.question_id) AS answer_list
          ) AS anseer_key_value_list
      ) AS answers
      FROM questions
      WHERE product_id = ${product_id} AND reported='0'
      LIMIT ${count} OFFSET ${offset}`;
    return client.query(queryStr3)
      .then((result) => {
        //console.log(result.rows);
        results.results = result.rows;
        return results;
      })
      .catch(err => {
        console.error('get questions: ', err)
        throw err
      });
  },

  addQuestion: (question) => {
    return client.query(`INSERT INTO questions VALUES(nextval('questions_seq'), $1, $2, $3, $4, $5)`, question)
      .catch(err => {
        console.error('add questions: ', err)
        throw err
      });
  },

  addAnswer: (answer) => {
    return client.query(`INSERT INTO answers VALUES(nextval('answers_seq'), $1, $2, $3, $4, $5)`, answer)
      .catch(err => {
        console.error('add answer: ', err)
        throw err;
      });
  },

  addAnswerWithPhotos: (answer, photos) => {
    return client.query(`INSERT INTO answers VALUES(nextval('answers_seq'), $1, $2, $3, $4, $5) returning answer_id`, answer)
      .then((result) => {
        let id = result.rows[0].answer_id;
        return Promise.all(photos.map(photo => {
          return client.query(`INSERT INTO photos VALUES(nextval('photos_seq'), '${photo}', ${id})`)
        }))
        .catch(err => {
          console.error('promise: ', err)
          throw err;
        });
      })
      .catch(err => {
        console.error('add answer with photo: ', err)
        throw err;
      });
  },

  updateHelpQuestion: (question_id) => {
    return client.query(`UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id=${question_id}`)
      .catch(err => {
        console.error('update question help', err);
        throw err;
      })
  },
  updateHelpAnswer:(answer_id) => {
    return client.query(`UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id=${answer_id}`)
    .catch(err => {
      console.error('update answer help', err);
      throw err;
    })
  },
  updateReportQuestion: (question_id) => {
    console.log('Reported Question');
    return client.query(`UPDATE questions SET reported ='1' WHERE question_id=${question_id}`)
      .catch(err => {
        console.error('report question', err);
        throw err;
      })
  },

  updateReportAnswer: (answer_id) => {
    return client.query(`UPDATE answers SET reported ='1' WHERE answer_id=${answer_id}`)
    .catch(err => {
      console.error('report answer', err);
      throw err;
    })
  }
}