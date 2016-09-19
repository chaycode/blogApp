var express = require('express');
var router = express.Router();
var knex = require('../db/knex')
var bcrypt = require('bcrypt')
var passport = require('passport')

function getUser(){
  return knex('user_tbl')
}

function getPost(){
  return knex('post_tbl')
}

function getComment(){
  return knex('comment_tbl')
}

function commentUser(){
  return knex('*').from('post_tbl').leftJoin('comment_tbl', 'post_tbl.id', 'comment_tbl.post_id')
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next){
  console.log(getUser().username)
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
    }
 })(req, res, next)
})

// router.get('/home', function(req, res, next){
//   getPost().orderBy('id', 'asc')
//   .then(function(data){
//       res.render("home", {posts: data})
//   })
// })

// router.get('/home', function(req, res, next){
//   commentUser()
//   .then(function(data){
//     console.log("COMMENT USER DASTA:", data)
//       res.render("home", {posts: data})
//   })
// })

router.get('/home', function(req, res, next){
  var everything = []
  getPost()
  .then(function(data){
    everything.push(data)
    console.log("THE FIRST EVERYTHING:  ",everything)
    getComment()
    .then(function(data){
      everything.push(data)
      console.log("EVERYHTING 2222:: ", everything)
      res.render('home', {posts: everything[0], comments: everything[1]})
    })
  })
})

router.post('/createPost', function(req, res, next){
  getPost()
  .insert({title: req.body.postTitle, content: req.body.postContent})
  .then(function(data){
    res.redirect('/home')
  })
})

router.get('/post/:id', function(req, res, next){
  var commentPosts = []
  getComment().where('post_id', req.params.id)
  .then(function(data){
      commentPosts.push(data)
      console.log("FIRST COMMENT POSTS:   ",commentPosts)
    getPost().where("id", req.params.id)
    .then(function(data){
        commentPosts.push(data)
      console.log("SECOND COMMENTPOSTS:  ", commentPosts)
      console.log("DATA [1]!!!!:", commentPosts[1], "DATA [0]!!!::: ", commentPosts[0])
      res.render('post', {posts: commentPosts[1], comments: commentPosts[0]})
    })
  })
})

router.get('/delete/:id',function(req, res, next){
  var param = req.params.id.replace(/:/g,"")
  console.log(req.params.id, param)
  getPost().where('id', param)
  .delete()
  .then(function(data){
    res.redirect('/home')
  })
})

router.get('/update/:id', function(req, res, next){
  var param = req.params.id.replace(/:/g,"")
  getPost().where('id', param)
  .then(function(data){
    console.log("THIS DAT RITE HERR", data)
      res.render('updateThis', {data})
  })
})

router.post('/update/:id', function(req, res, next){
  var param = req.params.id.replace(/:/g,"")
  console.log(req.params.id, param, req.body.updateTitle, req.body.updateContent)
  getPost().where('id', req.params.id)
  .update({title: req.body.updateTitle, content: req.body.updateContent})
  .then(function(data){
    console.log("DATA COMING TRU", data)
    res.redirect('/post/'+param)
  })
})

router.post('/comment/:id', function(req, res, next){
console.log("THIS IS REQQQQQ:::   ",req.body.comment)
var param = req.params.id.replace(/:/g, "")
  getComment()
  .insert({comment: req.body.comment, post_id: param})
  .then(function(data){
    console.log("THIS IS DATTAAAA:", data)
    res.redirect('/post/'+param)
  })
})

// router.get('/update/:id', function(req, res, next){
  // var param = req.params.id.replace(/:/g,"")
  // getPost().where('id', param)
  // .then(function(data){
      // res.render('updateThis')
  // })
// })

// router.post('update/:id')

module.exports = router;
