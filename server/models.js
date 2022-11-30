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

module.exports = {
  getAnswers: (answers) => {
    let offset = (answers.page-1) * answers.count;
    console.log(answers);
    return client.query(`SELECT json_agg(
      json_build_object(
        'answer_id', answers.answer_id,
        'body', answers.body,
        'date', answers.date,
        'answerer_name', answers.answerer_name,
        'helpfulness', answers.helpfulness,
        'photos', coalesce(photos, '[]')
      )
    )FROM (
      SELECT * FROM answers
      WHERE answers.question_id=${answers.question}
      LIMIT ${answers.count} OFFSET ${offset}) AS answers
    LEFT JOIN(
      SELECT answer_id, json_agg(
        json_build_object(
          'id', photos.photo_id,
          'url', photos.url
        )
      ) photos FROM photos GROUP BY 1
    ) photos ON answers.answer_id=photos.answer_id
    `)
      .then((result) => {
        //console.log(result.rows[0]);
        answers.results = !result.rows.length ? result.rows : result.rows[0].json_agg;
        console.log('return answers', answers);
        return answers;
      })
      .catch(err => {
        console.error('get answers', err)
        throw err;
      });
  },

  getQuestions: (product_id,count,page,results) => {
    let offset = (page - 1) * count;
    let queryStr = `SELECT json_agg(
        json_build_object(
          'question_id', q.question_id,
          'question_body', q.question_body,
          'question_date', q.question_date,
          'asker_name', q.asker_name,
          'question_helpfulness', q.question_helpfulness,
          'reported', q.reported,
          'answers', coalesce(answers, '[]')
        )
      ) FROM (
        SELECT * FROM questions
        WHERE product_id=${product_id}
        LIMIT ${count} OFFSET ${offset}
      ) AS q LEFT JOIN(
      SELECT question_id, json_object_agg(
        a.answer_id,
        json_build_object(
          'id', a.answer_id,
          'body', a.body,
          'answerer_name', a.answerer_name,
          'helpfulness', a.helpfulness,
          'photos', coalesce(photos, '[]')
        )
      )answers FROM answers a
        LEFT JOIN(
          SELECT answer_id, json_agg(
            p.url
          ) photos FROM photos p GROUP BY 1
      ) p ON a.answer_id=p.answer_id
      GROUP BY 1
    )a ON q.question_id=a.question_id
   `;
    return client.query(queryStr)
      .then((result) => {
        //console.log(result.rows[0].json_agg);
        results.results = !result.rows[0] ? result.rows : result.rows[0].json_agg
        console.log(results);
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
    return client.query(`INSERT INTO answers VALUEWS(nextval('answers_seq'), $1, $2, $3, $4, $5)`, answer)
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
    return client.query(`UPDATE questions SET reported = '1' WHERE question_id=${question_id}`)
      .catch(err => {
        console.error('report question', err);
        throw err;
      })
  },

  updateReportAnswer: (answer_id) => {
    return client.query(`UPDATE answers SET reported = '1' WHERE answer_id=${answer_id}`)
    .catch(err => {
      console.error('report answer', err);
      throw err;
    })
  }
}