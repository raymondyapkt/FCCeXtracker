const express = require('express')
const app = express()
const cors = require('cors')
var bodyParser = require('body-parser')
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// ####################

var uID = 0;
var exLs = {};

app.post("/api/users", function(req, res) {
  var username = req.body.username;
  uID++;
  var id =  ('fd' + uID.toString().padStart(3,"0") )
  exLs[id] = {"username":username,"_id":id} 
  res.json( exLs[id] );
});

app.get("/api/users", function (req, res) {
  var lists = [] 
  for (id in exLs) lists.push(exLs[id])
  console.log (  lists )
  res.json( lists )
});

var count = 1
var logs =[]

app.post("/api/users/:_id/exercises", function(req, res) {
  var { _id } = req.params
  var description = req.body.description;
  var duration    = parseInt(req.body.duration);
  var date        = req.body.date;
  var dateA = 0 
  if ( date == "" ) { dateA = new Date().toDateString()}
  else          { dateA = new Date().toDateString(date) } 


  var log = { //'description': description,
              'duration'   : duration,
             // 'date'       : dateA, 
               'id':_id 
            }
  console.log (  log )

  //exLs[_id]["log"] = logs.push(log)
  //exLs[_id]["count"] = count
  //count++
  
  //console.log ( exLs )
  //res.json( exLs[_id] )

   //  http://127.0.0.1:3000/api/users/ffcd00000001/exercises
});

// ####################



/*
app.route("/api/user").get((req, res) => {
  const username = req.body.username;
  res.json({username:username});
}).post(async (req, res) => {
  const  { username } = req.body.username
  uID++;
  exLs[uID] = {'username':req.body.username,
      '+id' : ( 'ffcd' + uID.toString().padStart(8,"0") ) }
  console.log(exLs)
});
*/


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
