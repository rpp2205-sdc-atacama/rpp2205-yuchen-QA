const {Client} = require('pg');
const { expand } = require('./helper.js');
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
  getAnswers: (req, res) => {
    const question_id = req.params.question_id;
    const count = !req.query.count ? 5 : req.query.count;
    const page = !req.query.page ? 1 : req.query.page;
    let offset = (page-1) * count;
    let answers = {question: question_id, page: page, count: count};
    return client.query(`SELECT json_build_object(
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
        WHERE answers.question_id=${question_id}
        LIMIT ${count} OFFSET ${offset}`)
      .then((result) => {
        //console.log(result.rows[0].json_build_object);
        if (!result.rows.length) {
          answers.results = result.rows;
          return res.status(200).json(answers);
        }
        answers.results = result.rows[0].json_build_object;
        console.log('return answers: ', answers);
        res.status(200).json(answers);
      })
      .catch(err => console.error('getAnswer erL:', err));
  },

  getQuestions: (req, res) => {
    const product_id = Number(req.query.product_id);
    const count = !req.query.count ? 5 : Number(req.query.count);
    const page = !req.query.page ? 1 : Number(req.query.page);
    let offset = (page - 1) * count;
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
    WHERE q.product_id=${product_id}
    LIMIT ${count} OFFSET ${offset}`;
    //console.log(queryStr);
    return client.query(queryStr)
      .then((result) => {
        if (!result.rows[0]) {
          results.results = result.rows;
          return res.status(200).json(results);
        }
        console.log('results:  ', result.rows[0]);
        results.results = result.rows[0].json_build_object.results;
        res.status(200).json(results);
      })
      .catch(err => {
        console.log('err, ',err);
        res.status(400).json(err)});
  },
  addQuestion: (req, res) => {
    const question = [req.body.product_id, req.body.name, req.body.email, req.body.body, new Date(Date.now()).toISOString()]
    console.log('new q: ', question);
    return client.query(`INSERT INTO questions VALUES(nextval('questions_seq'), $1, $2, $3, $4, $5)`, question)
      .then(() => {
        res.status(201).send('new question added!');
      })
      .catch(err => console.error('insert new question err: ', err.stack));
  },

  addAnswer: (req, res) => {
    const answer = [parseInt(req.params.question_id), req.body.name, req.body.email, req.body.body, new Date(Date.now()).toISOString()]
    if (!req.body.photos.length) {
      return client.query(`INSERT INTO answers VALUEWS(nextval('answers_seq'), $1, $2, $3, $4, $5)`, answer)
      .then(() => {
        res.status(201).send('added new answers without photos');
      })
      .catch(err => {
        console.log('no photo: ', err);
        res.status(400).json(err);
      });
    };
    return client.query(`INSERT INTO answers VALUES(nextval('answers_seq'), $1, $2, $3, $4, $5) returning answer_id`, answer)
    .then((result) => {
      let id = result.rows[0].answer_id;
      return Promise.all(req.body.photos.map(photo => {
        return client.query(`INSERT INTO photos VALUES(nextval('photos_seq'), '${photo}', ${id})`)
      }))
      .catch(err => {
        console.log('promise: ', err)
        res.status(400).send(err)
      })
    })
    .then(() => res.status(201).send('added new answers with photos'))
    .catch(err => { console.log("has photo", err);
    res.status(400).send(err)
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