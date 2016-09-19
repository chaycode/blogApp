var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var knex = require('./db/knex') //comment check this if things not working
var bcrypt = require('bcrypt')

function getUser(username){
  console.log("looking for this user: ", username)
  return knex('user_tbl')
  .where("username", username)
}

passport.use(
  new LocalStrategy(function(username, password, done){
    console.log("GOT LOCALthis username:  ", username, " and passwored:  ", password)
    return getUser(username)
      .then(function(data){

        done(null, data)
      })
  }))

passport.serializeUser(function(user, done){
  done(null, user)
})

passport.deserializeUser(function(user, done){
  done(null, user)
})
