const express = require('express');
const {getQuestions, getAnswers, addQuestion, addAnswer, updateHelpQuestion, updateHelpAnswer, updateReportQuestion, updateReportAnswer} = require('./controllers.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.json({info: 'Node.js, Express, and Postgres API'})
})


app.get('/qa/questions', getQuestions)

app.get('/qa/questions/:question_id/answers', getAnswers);

app.post('/qa/questions', addQuestion);

app.post('/qa/questions/:question_id/answers', addAnswer);

app.put('/qa/questions/:question_id/helpful', updateHelpQuestion);

app.put('/qa/answers/:answer_id/helpful', updateHelpAnswer);

app.put('qa/questions/:question_id/report', updateReportQuestion);

app.put('/qa/answers/:answer_id/report', updateReportAnswer);

const port = 3000;
app.listen(port,() => {
  console.log(`App running on port ${port}`)
})