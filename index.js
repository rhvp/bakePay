const express = require('express');
const bodyParser = require('body-parser');




const port = process.env.PORT || 3300;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('./routes/api'));


app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.listen(port, () => {
  console.log(`Listening on ${port}`);
})
