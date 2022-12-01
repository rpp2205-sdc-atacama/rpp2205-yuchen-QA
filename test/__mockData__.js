module.exports = {
  quesitons: [
    {question_id: 1, product_id:1, akser_name:'test1', asker_email:'test1@gmail.com', question_body:'Hey THis is a question test body', question_date: '2021-12-21 00:16:59-06', question_helpfulness:0, reported: false},
    {question_id: 2, product_id:2, akser_name:'jest', asker_email:'tjest@gmail.com', question_body:'THis is a question test body from jest mock!', question_date: '2022-11-21 01:10:59-08', question_helpfulness:1, reported: false},
    {question_id: 3, product_id:1, akser_name:'jest88', asker_email:'test1@gmail.com', question_body:'Product1 second question THis is a question test body', question_date: '2022-11-30 16:16:59-06', question_helpfulness:5, reported: false},
  ],
  answers: [
    {answer_id:1, question_id:1, answerer_name:'answer1', answerer_email:'answer1@123.com', body:'answer of 1st question', date: '2021-12-30 01:31:46-06', helpfulness:0, reported: false},
    {answer_id:2, question_id:1, answerer_name:'test3', answerer_email:'answer1@123.com', body:'2nd answer of 1st question', date: '2022-11-10 16:20:11-06', helpfulness:0, reported: false},
    {answer_id:3, question_id:1, answerer_name:'test8988', answerer_email:'answer1@123.com', body:'3rd answer of 1st question', date: '2022-11-30 01:10:46-06', helpfulness:0, reported: false},
  ],

  photos: [
    {photo_id:1, url:"https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80", answer_id: 2},
    {photo_id:2, url:"https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80", answer_id: 2},
    {photo_id:3, url:"https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80", answer_id: 2},
  ]
}