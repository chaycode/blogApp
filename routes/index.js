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
    getUser()
    .insert({
       username: req.body.newUsername,
       password: bcrypt.hashSync(req.body.newPassword, 10)
     })
     .then(function(data){
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
  console.log(req.body)
  passport.authenticate('local', function(err, user, info){
    console.log(err, user, info)
   return res.redirect('/users')
 })(req, res, next)
})

// app.post('/auth', passport.authenticate('local'), function(req, res){
//   console.log("passport user", req.user);
// });

module.exports = router;
