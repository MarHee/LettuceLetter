//res.sendFile(__dirname + "/views/upload_formular_canvas.html")

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

// Initialisierung express-fileupload
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// Ordner "images" öffentlich machen, hier werden hochgeladene Bilder abgelegt
app.use(express.static(__dirname + '/images'));

// Ordner "scripts" öffentlich machen; von hier aus werden Skripte mit JS im Browser geladen
app.use(express.static(__dirname + '/scripts'));

// Ordner "css" öffentlich machen, hier wird alles, was mit css zu tun hat abgelegt
app.use(express.static(__dirname + "/css"));



let gameID = 3;
let varRound = 2;
let varRoundComplete = "round" + varRound;

console.log(`suche nach ${varRoundComplete}`);
console.log(scripts/getRound.varRounds);

let sql = `SELECT ${varRoundComplete}
           FROM games
           WHERE gameID  = ?`;

// sollte die gespielten Runden ausgeben
db.get(sql, [gameID], (err, row) => {
  if (err) {
    return console.error(err.message);
  } return row 
    ? console.log(row)
    : console.log(`No Game found with the ID ${gameID}`);

});

db.close((err) => {
    if (err) {
    console.error(err.message);
    }
    console.log('Close the database connection.');
    });