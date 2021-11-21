//Verbindung zur Datenbank
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('lettuce.db', (err) => {
if (err) {
console.error(err.message);
}
console.log('Connected to the lettuce database.');
});

// Initialisierung Express
const express = require('express');
const app = express();

// Initialisierung body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

// Initialisierung EJS
app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// Server starten
app.listen(3000, function(){
    console.log('listening on port 3000');
    });
    
    
app.use(express.static(__dirname + '/views'));    

app.get('/login', function(req, res){
    res.sendFile(__dirname + '/login.html');
});
app.get('/start', function(req, res){
    res.sendFile(__dirname + '/start.html');
});
app.get('/register', function(req, res){
    res.sendFile(__dirname + '/register.html');
});

//Loginfunktion
app.post("/userLogin", function(req, res){
    const param_username = req.body.username;
    const param_password = req.body.password;
    
    // Datenbank durchsuchen nach username und passendem PW
    db.all(
        `SELECT * FROM users WHERE name="${param_username}" AND password="${param_password}"`, (err, rows) => {
            if (rows.length != 0){
                res.send(`Willkommen zurück, ${param_username}`);
            } else if (err) {
                res.send(err.message);
            } else {
                res.redirect("/register")
            }
        }, 
    );
});

//Registrierfunktion
app.post('/userRegister', function(req, res){
    const param_usernameInput = req.body.usernameInput;
    const param_passwordInput = req.body.passwordInput;
    const param_passwordRepeat = req.body.passwordRepeat;

    if (param_passwordInput.match(/^[0-9]+$/) || param_passwordInput.length < 6){
        res.send("Dein Passwort ist etwas zu einfach")
    } else if (param_passwordRepeat != param_passwordInput){
        res.send("Deine Eingaben passen nicht zusammen")
    } else {
        db.run( `INSERT INTO users (name, password) VALUES ('${param_usernameInput}', '${param_passwordInput}')`, function(err){
            if (err){
                res.send(err.message)
            } else {
                res.send("Willkommen " + param_usernameInput);
            }
        });   
    } 
});

//Schließen der Datenbank
db.close((err) => {
    if (err) {
    console.error(err.message);
    }
    console.log('Close the database connection.');
    });