const db = require('./models.js');

module.exports = {
  getAnswers: (req, res) => {
    const question_id = parseInt(req.params.question_id);
    const count = !req.query.count ? 5 : Number(req.query.count);
    const page = !req.query.page ? 1 : Number(req.query.page);
    let answers = {question: question_id, page: page, count: count};
    return db.getAnswers(answers)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch(err => res.status(400).send(err));
  },

  getQuestions: (req, res) => {
    const product_id = Number(req.query.product_id);
    const count = !req.query.count ? 5 : Number(req.query.count);
    const page = !req.query.page ? 1 : Number(req.query.page);
    let results = {product_id: product_id};
    return db.getQuestions(product_id,count,page,results)
      .then((questions) => {
        res.status(200).json(questions);
      })
      .catch(err => res.status(400).send(err));
  },

  addQuestion: (req, res) => {
    const question = [req.body.product_id, req.body.name, req.body.email, req.body.body, new Date(Date.now()).toISOString()]
    console.log('new q: ', question);
    return db.addQuestion(question)
      .then(() => {
        res.status(201).send('new question added!');
      })
      .catch(err => res.status(400).json(err));
  },

  addAnswer: (req, res) => {
    const answer = [parseInt(req.params.question_id), req.body.name, req.body.email, req.body.body, new Date(Date.now()).toISOString()];
    let photos = req.body.photos;
    console.log('new answer', answer, photos);
    if (!photos || !photos.length) {
      return db.addAnswer(answer)
        .then(() => res.status(201).send('added new answers without photos'))
        .catch(err => res.status(400).send(err));
    }
    return db.addAnswerWithPhotos(answer, photos)
      .then(() => res.status(201).send('added new answers with photos'))
      .catch(err => res.status(400).send(err));
  },

  updateHelpQuestion: (req, res) => {
    return db.updateHelpQuestion(req.params.question_id)
      .then(() => {
        res.status(204).send('helpfulness added');
      })
      .catch(err => res.status(400).json(err));
  },

  updateHelpAnswer:(req, res) => {
    return db.updateHelpAnswer(req.params.answer_id)
      .then(() => {
        res.status(204).send('helpfulness added');
      })
      .catch(err => res.status(400).json(err));
  },

  updateReportQuestion: (req, res) => {
    return db.updateReportQuestion(req.params.question_id)
    .then(() => {
      res.status(204).send('reqestion reported!');
    })
    .catch(err => res.status(400).json(err));
  },

  updateReportAnswer: (req, res) => {
    return db.updateReportAnswer(req.params.answer_id)
    .then(() => {
      res.status(204).send('answer reported!');
    })
    .catch(err => res.status(400).json(err));
  }
}