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
        'photos', photos
      )
    )FROM answers
    LEFT JOIN(
      SELECT answer_id, json_agg(
        json_build_object(
          'id', photos.photo_id,
          'url', photos.url
        )
      ) photos FROM photos GROUP BY 1
    ) photos ON answers.answer_id=photos.answer_id
    WHERE answers.question_id=${answers.question}
    LIMIT ${answers.count} OFFSET ${offset}`)
      .then((result) => {
        console.log(result.rows[0]);
        if (!result.rows.length) {
          answers.results = result.rows;
        } else {
          answers.results = result.rows[0].json_agg;
        }
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
    WHERE q.product_id=${product_id}
    LIMIT ${count} OFFSET ${offset}`;
    return client.query(queryStr)
      .then((result) => {
        results.results = !result.rows[0] ? result.rows : result.rows[0].json_build_object.results
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

  updateHelpQuestion: (req, res) => {
    console.log('help question: ', req.body)
  },
  updateHelpAnswer:(req, res) => {
    console.log('help answer')
  },
  updateReportQuestion: (req, res) => {
    console.log('Reported Question');
  },
  updateReportAnswer: (req, res) => {
    console.log(' Report Answer')
  }
}