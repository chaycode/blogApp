var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var knex = require('./db/knex') //comment check this if things not working
var bcrypt = require('bcrypt')

function getUser(username){
  return knex('user_tbl')
  .where(username)
}

passport.use( new LocalStrategy(function(username, password, done){
  console.log("trying for local")
  getUser({ username }) //check this for failures
  .then(function(data){
    console.log(data)
    done(null, true, data)
  })
}))

passport.serializeUser(function(user, done){
  done(null, user)
})

passport.deserializeUser(function(user, done){
  done(null, user)
})
