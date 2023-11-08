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
  exLs[id] = {"username":username} 
  res.json({"username":exLs[id]["username"],"_id":id}  );
});

app.get("/api/users", function (req, res) {
  var lists = [] 
  for (id in exLs) lists.push({"username":exLs[id]["username"],"_id":id})
  res.json( lists )
});

app.post("/api/users/:_id/exercises", function(req, res) {
  var { _id } = req.params
  var description = req.body.description;
  var duration    = parseInt(req.body.duration);
  var date        = req.body.date
  if (typeof date === "undefined" || date ===""  ) {
        var dateA = new Date().toDateString()}
  else{ var dateA = new Date(req.body.date).toDateString() } 
  var log = { 'description': description,
              'duration'   : duration,
              'date'       : dateA, 
            }

  if ("log" in exLs[_id] ) {
    exLs[_id]["log"].push(log)
    exLs[_id]["count"] ++
  } else { 
    exLs[_id]["count"] = 1; 
    exLs[_id]["_id"] = _id 
    exLs[_id]["log"] = [log]
  }

  var exObj = {}  
  exObj["username"]    = exLs[_id]["username"]
  exObj["description"] = description,
  exObj["duration"]    = duration,
  exObj["date"]        = dateA 
  exObj["_id"]         = _id
  console.log(exObj["_id"],exLs[_id]["log"])
  res.json( exObj  )
});

app.get("/api/users/:_id/logs", function(req, res) {
  var { _id } = req.params
  var { from , to , limit } = req.query
  if (typeof from === "undefined" ){res.json( exLs[_id])}
  else{  
    console.log( _id ,from , to , limit )
  }
   


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
