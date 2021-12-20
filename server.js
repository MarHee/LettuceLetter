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

// Server starten
app.listen(3000, function(){
    console.log('listening on port 3000');
});

const fs = require('fs');
const req = require('express/lib/request');

// Hier kann man zeichnen und Bilder hochladen in images
// app.get("/upload", function(req, res){
 //   res.sendFile(__dirname + "/views/upload_formular_canvas.html");
// });

let testFilename = "Dateiname Bild";

/* TODO:
    GameSessionID & Runde in Bild Dateinamen
    Verknüpfung mit Gametable
    Bild aus Datenbank abrufen & anzeigen
*/

// Auswertung des Upload-Formulars
app.post('/onupload', function(req, res) {
    // siehe http://zhangwenli.com/blog/2015/12/27/upload-canvas-snapshot-to-nodejs/ von Plaß

    const dataURL = req.body.img;
    var matches = dataURL.match(/^data:.+\/(.+);base64,(.*)$/);
    var buffer = new Buffer.from(matches[2], 'base64');
  
    // speichert die Datei im Ordner images (der muss natürlich existieren)
    testFilename = "Testbild" + Date.now() + ".png"; //TODO: Dateinamen in GameID+Runde ändern
    // console.log(testFilename);
    fs.writeFile(__dirname + "/images/" + testFilename, buffer, function (err) {
      console.log("done");
    });
  });
  
  // Zeigt das Bild an 
app.get('/bildzeigen', function(req, res){
    // console.log(testFilename);
    res.render("bildzeigen", {"filename": testFilename});
  });
    
    
app.use(express.static(__dirname + '/views'));    

app.get('/login', function(req, res){
    res.sendFile(__dirname + '/views/login.html');
});
app.get('/start', function(req, res){
    res.sendFile(__dirname + '/views/start.html');
});
app.get('/register', function(req, res){
    res.sendFile(__dirname + '/views/register.html');
});
app.get('/activegames', function(req, res){
    res.sendFile(__dirname + '/views/activegames.ejs');
});
/*
app.get('/game', function(req, res){
    res.sendFile(__dirname + '/views/game.html');
});
*/

//Play-Button von Start
// Testen ob User angemeldet ist?
app.post("/play", function(req,res){    
    res.redirect("/login");
});

//Spielen-Button von Login
<<<<<<< Updated upstream
app.post("/playAngemeldet", function(req,res){    
    res.sendFile(__dirname + "/views/gameFirst.html");
});

// Hier wird die Eingabe aus dem Server in die db gespeichert 
// Geht noch nicht Fehlermeldung "round1 existiert nicht in games" -> .read initalizeTables.sql geht auch nicht 

app.post("/Runde1", function(req,res){    
    const Zeichnen= req.body.wasZeichnen;

    console.log(Zeichnen);

    db.run( `INSERT INTO games (roundsPlayed, round1) VALUES ('1', '${ Zeichnen } ')`, function(err){
        if (err){
            res.send(err.message)
        } else {
            res.sendFile(__dirname + "/views/upload_formular.html");
        }
    });   
=======
//redirect auf activegames?
// Testwert gameID = 1
app.post("/playAngemeldet", function(req,res){
    //GameID sammeln 
    var testID = 1; 
    
    //Runde sammeln
    var round = db.all(`SELECT roundsplayed FROM games WHERE GameID = ${testID}` // Testen ob Spiel noch aktiv, sonst zu Galerie
    );
    
    //Rundenanzahl zur Spaltensuche
    db.all(`SELECT round"${round}" FROM games WHERE GameID = ${testID}`, (err, ) => { // variable rounds kein Parameter für sqlite in ejs, etwas wie rows etc finden
        //senden zu Text/Bild eingabe mit Anzeige von letzter Runde
        if (round % 2 == 0) { //gerade Rundenanzahl ==> Bild
           res.sendFile(__dirname + "/views/upload_formular_canvas.html"); 

        } else { //ungerade Rundenanzahl ==> Text

        }


    })
    
    
    //speichern in nächste Runde Spalte

    
});

app.post("/postText", functiom (req, res){
    const textInput = req.body.textInput;
    //GameID und Runde abfragen
    db.all(`ALTER TABLE games INSERT ` //text in entsprechende Spalte)

>>>>>>> Stashed changes
});



 app.get("/chat", function(req, res){
    res.sendFile(__dirname + "/views/chat.html");

});

//Zeichenfunktion
app.get("/spielen",function(req,res){
    res.sendFile(__dirname + "/views/upload_formular.html");
})

//Loginfunktion
app.post("/userLogin", function(req, res){
    const param_username = req.body.username;
    const param_password = req.body.password;
    
    // Datenbank durchsuchen nach username und passendem PW
    db.all(
        `SELECT * FROM users WHERE name="${param_username}" AND password="${param_password}"`, (err, rows) => {
            if (rows.length != 0){
                res.render("loginErfolgreich", {"benutzername": param_username});
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
/*db.close((err) => {
    if (err) {
    console.error(err.message);
    }
    console.log('Close the database connection.');
    });
    */
   