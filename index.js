const express = require('express')
const app = express()
const cors = require('cors')
let bodyParser = require('body-parser')
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// ####################


app.route("/api/shorturl").get((req, res) => {
  const url = req.body.url;
  res.json({url:url});
}).post(async (req, res) => {
  try {
    const { hostname } = new URL(req.body.url);
 
  } catch (e) {
    res.json({ error: 'invalid url' });
  }
});

// ####################

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
