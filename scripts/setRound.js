//
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

let varRounds = 3;

let sql = `UPDATE games 
        SET roundsPlayed = ${varRounds}
        WHERE gameID  = 3;`;
let gameID = 3;


// sollte die gespielten Runden ausgeben
db.run(sql, function(err, row){
  if (err) {
    return console.error(err.message);
  } //console.log("1 record changed " + row.roundsPlayed);
  /*let varRoundsNew = row.roundsPlayed
  console.log("Test" + varRoundsNew);
  return varRoundsNew
  /*
    ? console.log(row.roundsPlayed)
    : console.log(`No Game found with the ID ${gameID}`);
*/
});

db.close((err) => {
    if (err) {
    console.error(err.message);
    }
    console.log('Close the database connection.');
    });
//roundsPlayed +1


// Bild/Text in Datenbank speichern