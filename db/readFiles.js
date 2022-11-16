const fs = require('fs');
const Promise = require('bluebird');
const { parse } = require("csv-parse");
const { addUser, addQuestion, findCount } = require('./db.js');

const addNew = (data) => {
  return addUser(data.slice(4, 6))
    .then((id) => {
      let question = data.slice(0, 4).concat(data.slice(6));
      question.splice(2, 0, id);
      return addQuestion(question);
    })
}
let promises = [];

fs.createReadStream("./../dataFiles/questions.csv")
  .pipe(parse({ delimiter:',', from_line:2, to_line:5}))
  .on("data", (row) => {
    row[0] = parseInt(row[0]);
    row[1] = parseInt(row[1]);
    row[3] = new Date(parseInt(row[3])).toISOString();
    let temp = row[6];
    row[6] = parseInt(row[7])
    row[7] = temp;
    let question = row.slice(0, 4).concat(row.slice(6));
    promises.push(addNew(row));
    //add user to our user table;
    // addUser(row.slice(4,6))
    //  .then((id) => {
    //   question.splice(2, 0, id)
    //   addQuestion(question)
    //  })

  })
  .on("end", () => {
    Promise.all(promises)
     .then(() => {
      return findCount('questions');
     })
     .then(() => {
      console.log('finished');
     })


  })
  .on("error", (err) => {
    console.error(err);
  })

