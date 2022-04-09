//Require dependencies
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

//Definiendo app express
const app = express();

console.log(process.env.API_KEY);

//Definiendo archivos locales, EJS, bodyparser
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Conexion local con la BD
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/userDB');
}

//Definiendo esquema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//Encryp
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

//Definiendo Modelo
const User = mongoose.model('User', userSchema);

//Metodos GET - Direccionamiento
app.get('/', (req, res) =>{
    res.render('home');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/register', (req, res) => {
    res.render('register');
})

//Metodos POST
app.post('/register', (req,res) => {
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    })
    
    newUser.save((err) => {
        if (err){console.log(err);}
        else{res.render('secrets')}
    }
    )
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser){
                if (foundUser.password === password){
                    res.render('secrets');
                }
            }
        }
    })
})

app.listen(3000, ()=>{
    console.log("Running on port 3k");
})