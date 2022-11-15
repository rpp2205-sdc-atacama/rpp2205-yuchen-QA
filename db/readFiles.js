const fs = require('fs');
const { parse } = require("csv-parse");
//dataFiles/questions.csv
fs.createReadStream("./../dataFiles/questions.csv")
  .pipe(parse({ delimiter:',', from_line:2}))
  .on("data", (row) => {
    row[0] = parseInt(row[0]);
    row[1] = parseInt(row[1]);
    row[3] = new Date(row[3]).toISOString();
    row[7] = pasreInt(row[7])
    let question = row.slice(0, 4).concat(row.slice(6));
    //add question to questions table;
    let user = row.slice(4,6);
    //add user to our user table;
  })
  .on("end", () => {
    console.log('finished');
  })
  .on("error", (err) => {
    console.error(err);
  })

