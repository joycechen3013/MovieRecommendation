var express = require('express');
var router = express.Router();
var path = require('path');

// Connect string to MySQL
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'fling.seas.upenn.edu',
  user: 'hanchen1',
  password: 'mysqlcis550',
  database: 'hanchen1'
});

connection.connect(function(err) {
  if (err) {
    console.log("Error Connection to DB" + err);
    return;
  }
  console.log("Connection established...");
});

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'login.html'));
});

router.get('/dashboard', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html'));
  
  //res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html'));
});

router.get('/reference', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'reference.html'));
});

router.get('/recommendations', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'recommendations.html'));
});
router.get('/Bestof', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'Bestof.html'));
});
router.get('/posters', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'posters.html'));
});

router.get('/users', function(req, res) {
  connection.query("select username from User", function(err, rows, fields) {
    if (err) console.log(err);
    else {
      //console.log(rows[0].username);
      res.json(rows);
    }
  });
});

router.get('/topMovies', function(req, res) {
  connection.query("select distinct genre from Genres", function(err, rows, fields) {
    if (err) console.log(err);
    else {
      //console.log(rows[0].username);
      res.json(rows);
    }
  });
});

router.get('/buttonMovies/:genre', function(req, res) {
  var myData = req.params.genre;
  console.log(req.params.genre);
  connection.query("select title, rating, vote_count from Movies join Genres on Movies.id=Genres.movie_id where genre='"+myData+"' order by rating DESC, vote_count DESC limit 10", function(err, rows, fields) {
    if (err) console.log(err);
    else {
      //console.log(req.body.genre);
      res.json(rows);
    }
  });
});
// router.get('/moviegenre/:movieid', function(req, response) {
//   var data = req.params.movieid;
//   console.log(data);
//   var query1 = "select genre from Movies join Genres on Movies.id=Genres.movie_id where Movies.id='"+data+"'";

//     connection.query(query1, function(err, res) {
//       if (err) console.log(err);
//       else{
//         console.log(res)
//         response.json(res)
//         //var tempRes=res;
//       }
//     });
// });

// router.get('/moviegenres/:movieid', function(req, response) {
//   var data = req.params.movieid;
//   console.log(data);
//   var query1 = "select Movies.title as title, genre from Movies join Genres on Movies.id=Genres.movie_id where genre in (select genre from Movies join Genres on Movies.id=Genres.movie_id where Movies.id="+data+")";

//     connection.query(query1, function(err, res) {
//       if (err) console.log(err);
//       else{
//         console.log(res)
//         response.json(res)
//         //var tempRes=res;
//       }
//     });
// });
router.get('/moviegenre/:movieid', function(req, response) {
  var data = req.params.movieid;
  console.log(data);
  var query1 = "select Min(Movies.id) as id, Movies.title as title, genre from Movies join Genres on Movies.id=Genres.movie_id where Movies.id!='"+data+"' and genre in (select genre from Movies join Genres on Movies.id=Genres.movie_id where Movies.id="+data+") group by genre";

    connection.query(query1, function(err, res) {
      if (err) console.log(err);
      else{
        console.log(res)
        response.json(res)
        //var tempRes=res;
      }

      // do some fitting here for the res. e.g. convert it into string for IN clause (stored in tempRes variable)

      // var query2 = "(SELECT title from ("+ tempRes +")) Union (select Movies.title from Movies join Genres on Movies.id=Genres.movie_id where Genres.genre in (select genre from ("+ tempRes +")) limit (10-"+ tempRes.length +"))";

      // connection.query(query2, function(err, res) {
      //   if (err) console.log(err);
      //   response.json(res);
      // });
    });
});

router.get('/moviegenres/:movieid', function(req, response) {
  var data = req.params.movieid;
  console.log(data);
  var query1 = "select distinct Movies.title as title, genre from Movies join Genres on Movies.id=Genres.movie_id where Movies.id!='"+data+"'and genre in (select genre from Movies join Genres on Movies.id=Genres.movie_id where Movies.id="+data+") and Movies.id not in(select Min(Movies.id) from Movies join Genres on Movies.id=Genres.movie_id where Movies.id!='"+data+"'and genre in (select genre from Movies join Genres on Movies.id=Genres.movie_id where Movies.id="+data+") group by genre) group by title";

    connection.query(query1, function(err, res) {
      if (err) console.log(err);
      else{
        console.log(res)
        response.json(res)
        //var tempRes=res;
      }
    });
});
router.get('/yearMovies/:selectedYear', function(req, response) {
  var data = req.params.selectedYear;
  //console.log(data);
  var query1 = "select Movies.title as title, Genres.genre as genre, Max(vote_count) as votes from Movies join Genres on Movies.id=Genres.movie_id where Movies.release_year='"+data+"' group by Genres.genre";

    connection.query(query1, function(err, res) {
      if (err) console.log(err);
      else{
        console.log(res)
        response.json(res)
        //var tempRes=res;
      }
    });
});
router.get('/poster', function(req, response) {
  //console.log(data);
  var query1 = "select distinct imdb_id as id, title from Movies order by rand() limit 10";

    connection.query(query1, function(err, res) {
      if (err) console.log(err);
      else{
        console.log(res)
        response.json(res)
        //var tempRes=res;
      }
    });
});


// To add a new page, use the templete below
/*
router.get('/routeName', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'fileName.html'));
});
*/

// Login uses POST request
router.post('/login', function(req, res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log(req.body); will show the print result in your terminal

  // req.body contains the json data sent from the loginController
  // e.g. to get username, use req.body.username
  var person={"username": req.body.username, "password":req.body.password};
  //var query = 'INSERT INTO User SET ?', person; /* Write your query here and uncomment line 21 in javascripts/app.js*/
  connection.query('INSERT INTO User SET ? ON DUPLICATE KEY UPDATE username=username', person, function(err, rows, fields){ 
    console.log("rows", rows);
    //console.log("fields", fields);
    if (err) console.log('insert error: ', err);
    else {
      res.json({
        result: 'success'
      });
    }
  });
});

// template for GET requests

// router.get('/dashboard', function(req, res) {

//   //var myData = req.params.customParameter;    // if you have a custom parameter
//   var query = 'select * from User';

//   // console.log(query);

//   connection.query("select * from User", function(err, rows, fields) {
//     console.log(rows);
//     if (err) console.log(err);
//     else {
//       console.log("rows", rows);
//       // res.json({
//       //   data:rows
//       // });
//     }
//   });
// });


module.exports = router;