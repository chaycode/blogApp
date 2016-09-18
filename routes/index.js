var express = require('express');
var router = express.Router();
var knex = require('../db/knex')
var bcrypt = require('bcrypt')
var passport = require('passport')

function getUser(){
  return knex('user_tbl')
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next){
  console.log(getUser(req.body.newUsername))
    getUser()
    .insert({
       username: req.body.newUsername,
       password: bcrypt.hashSync(req.body.newPassword.toLowerCase(), 10)
     })
     .then(function(data){
       console.log("Putting in THIS HASH: ", bcrypt.hashSync(req.body.newPassword, 10), "for this user:   ", req.body.newUsername, "HERE IS THE SAME HASH AGAIN:  ", bcrypt.hashSync(req.body.newPassword, 10))
       res.redirect("/")
     })
})
// router.post('/login',
//   (req, res, next) => {
//     passport.authenticate('local', (err, user, info) => {
//       if(!user){
//         return res.render('index', { message: info.message })
//       } else {
//         res.render('index', {user: user.info})
//         res.json(user.info)
//       }
//     })(req, res, next)
//   })

router.post('/login', function(req, res, next){
  console.log("this is req.body:  ",req.body)
  passport.authenticate('local', function(err, user, info){
    // user[0] is object coming thru, user[1] is undefined
    if(user[0] === undefined){
      console.log("getting this from LOocalStrategy: ",user)
      return res.send("username does not exist in database")
    } else {
      var hash = bcrypt.hashSync(req.body.password, 10)
      console.log("getting this from LOocalStrategy: ",user, "this is the HASH from LOGGING IN: ", hash, "THIS IS USER[0].password: ", user[0].password, "this is the user trying to get it:   ",req.body.username, "this is the password they are using: ", req.body.password)
      var pass = req.body.password
      var compare = bcrypt.compareSync(pass, user[0].password)
      console.log("BCRYPT.COMPARE:", compare)
      if(compare){
        res.redirect('/home')
      } else {
        res.send("your passwerd wes inkerrekt")
      }
      // return res.send('YOURE FUCKING RITE!!!')
    }
  //   console.log(err, user, info)
  //  return res.redirect('/users')
 })(req, res, next)
})

router.get('/home', function(req, res, next){
  res.render("home")
})

// app.post('/auth', passport.authenticate('local'), function(req, res){
//   console.log("passport user", req.user);
// });

module.exports = router;
