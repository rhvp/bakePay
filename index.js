const express = require('express');
const bodyParser = require('body-parser');


require('dotenv').config();

const port = process.env.PORT || 3300;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('./routes/api'));


app.set('view engine', 'ejs');
app.set('etag', false)
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  next()
})
app.use('/assets', express.static('assets'));
app.listen(port, () => {
  console.log(`Listening on ${port}`);
})
