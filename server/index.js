const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.json({info: 'Node.js, Express, and Postgres API'})
})
const port = 3000;
app.listen(port,() => {
  console.log(`App running on port ${port}`)
})