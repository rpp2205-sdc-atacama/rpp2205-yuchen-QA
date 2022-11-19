const express = require('express');
const {getQuestions, getAnswers} = require('./controllers.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.json({info: 'Node.js, Express, and Postgres API'})
})

// app.get('/qa', (req, res) => {
//   //console.log('product!', req.params);
//   res.send('connect to qa');
// });

app.get('/qa/questions/:product_id/:count', getQuestions)

// app.get('/qa/questions/:product_id', (req, res) => {
//   console.log('product_id', req.params)
//   res.json(req.params);
// })

app.get('/qa/questions/:question_id/answers/:count', getAnswers);

// app.post('/qa/questions', postQuestion);

// app.post('/qa/questions/:question_id/answers', postAnswer);

// app.put('/qa/questions/:question_id/helpful', updateHelpQuestion);

// app.put('/qa/answers/:answer_id/helpful', updateHelpAnswer);

// app.put('qa/questions/:question_id/report', updateReportQuestion);

// app.put('/qa/answers/:answer_id/report', updateReportAnswer);

const port = 3000;
app.listen(port,() => {
  console.log(`App running on port ${port}`)
})