

// http://127.0.0.1:3000/api/users/fd012/logs?2001-01-01&2001-01-04

app.get("/api/users/:_id/logs", function(req, res) {

    var { _id } = req.params  
    var {from , to , limit } = req.query
    console.log ( _id,  from, to , limit )

} ) 


