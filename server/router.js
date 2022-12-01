const { Router } = require('express');
const {getQuestions, getAnswers, addQuestion, addAnswer, updateHelpQuestion, updateHelpAnswer, updateReportQuestion, updateReportAnswer} = require('./controllers.js');

const router = Router();

router.get('/qa/questions', getQuestions)

router.get('/qa/questions/:question_id/answers', getAnswers);

router.post('/qa/questions', addQuestion);

router.post('/qa/questions/:question_id/answers', addAnswer);

router.put('/qa/questions/:question_id/helpful', updateHelpQuestion);

router.put('/qa/answers/:answer_id/helpful', updateHelpAnswer);

router.put('qa/questions/:question_id/report', updateReportQuestion);

router.put('/qa/answers/:answer_id/report', updateReportAnswer);

module.exports = router;