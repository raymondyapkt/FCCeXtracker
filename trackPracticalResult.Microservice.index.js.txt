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
  res.json( exObj  )
});

app.get("/api/users/:_id/logs", function(req, res) {

  var { _id } = req.params  
  var {from , to , limit } = req.query
  console.log(  from , to , limit )
  if  ( typeof from === "undefined" && 
        typeof limit === "undefined" ){res.json( exLs[_id])}
  else{  
    if     ( typeof(limit) === "undefined" ){
      limit =  exLs[_id]["log"].length
      dfrom   = new Date(from).setHours(0, 0, 0, 0)
      dto     = new Date(to  ).setHours(0, 0, 0, 0) 
    } else { limit = parseInt(limit)}

    var  tempLogs = {}
    tempLogs["username"] = exLs[_id]["username"]
    tempLogs["count"]    = exLs[_id]["count"]
    tempLogs["_id"]      = exLs[_id]["_id"]
    tempLogs["log"]      = []

    for ( i=0 ; i<exLs[_id]["log"].length ; i++ ) {
      var dateR = (new Date((exLs[_id]["log"][i]["date"]))).getTime() 
      if   ( dateR < dfrom  ||  dto < dateR  || limit == 0 ) { continue}
      else {  
        tempLogs["log"].push(exLs[_id]["log"][i])
        limit --  }
    }
    tempLogs["count"]    = tempLogs["log"].length
    console.log(  tempLogs )
    res.json(  tempLogs )
  }
});

// ####################

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
