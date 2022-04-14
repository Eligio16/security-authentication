//Require dependencies
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')


//Definiendo app express
const app = express();

//Definiendo archivos locales, EJS, bodyparser
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Inicializando sesion
app.use(session({
  secret: 'Thats our secret',
  resave: false,
  saveUninitialized: false
}))

//Inicializando pasport
app.use(passport.initialize());
app.use(passport.session());

//Conexion local con la BD
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/userDB");
}

//Definiendo esquema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//Definiendo Modelo
const User = mongoose.model("User", userSchema);

//Definiendo passport
passport.use(User.createStrategy());

passport.serializeUser( (user, done) => {
  done(null, user.id);
});

passport.deserializeUser( (id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

//Google OAuth 2.0
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile);
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

//Metodos GET - Direccionamiento
app.get('/', (req, res) => {
  res.render('home');
});

app.get("/login", (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/secrets', (req, res) => {
  if (req.isAuthenticated()) {
    User.find({"secret": {$ne: null}}, function(err, foundUsers){
      if (err){
        console.log(err);
      } else {
        if (foundUsers) {
          res.render("secrets", {usersWithSecrets: foundUsers});
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });

//Metodos POST
app.post('/register', (req, res) => {
  User.register({username:  req.body.username}, req.body.password, (err, user) => {
    if(err){
      console.log(err);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req,res, () => {
        res.redirect('/secrets');
      });
    }
  });
});

app.post('/login', (req, res) => {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, (err) => {
    if (err){
      console.log(err);
    } else {
      passport.authenticate('local')(req,res, () => {
        res.redirect('/secrets');
      });
    }
  })
});

app.listen(3000, () => {
  console.log('Running on port 3k');
});
