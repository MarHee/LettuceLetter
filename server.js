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

//TODO brauchen wir die noch? Eigentlich Nein, nur um zu testen ob das zeichnen an sich noch geht

// Hier kann man zeichnen und Bilder hochladen in images
// app.get("/upload", function(req, res){
 //   res.sendFile(__dirname + "/views/upload_formular_canvas.html");
// }); 

let testFilename = "Dateiname Bild";

let activeGameID = "Game" + 2; //Brauchen wir die noch?

// Auswertung des Upload-Formulars
app.post('/onupload', function(req, res) {
    // siehe http://zhangwenli.com/blog/2015/12/27/upload-canvas-snapshot-to-nodejs/ von Plaß

    const dataURL = req.body.img;
    var matches = dataURL.match(/^data:.+\/(.+);base64,(.*)$/);
    var buffer = new Buffer.from(matches[2], 'base64');
  
    // speichert die Datei im Ordner images (der muss natürlich existieren)
    testFilename = activeGameID + Date.now() + ".png";
    // console.log(testFilename); 
    fs.writeFile(__dirname + "/images/" + testFilename, buffer, function (err) {
      console.log("done");
      console.log("Bild gespeichert unter :" + testFilename);
    });
  });
  
  // Zeigt das Bild an
    app.get('/bildzeigen', function(req, res){
    // console.log(testFilename);
    res.render("bildzeigen", {"filename": testFilename});
    console.log("Ich zeige Bild: "+ testFilename );
  }); //TODO zeigt leider Bild nicht, referiert auf testFilename, was aber auch nicht angezeigt wird, wenn es eins der Bilder in images ist
    


//Aufrufe der views Seiten im respektiven Ordner
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
app.get('/test', function(req, res){
    res.sendFile(__dirname + '/views/test.html');
});

//TODO wird diese Funktion irgendwo aufgerufen? Ist ja ein Serveraufruf localhost:3000/gameBeginn . Wird nicht 
app.get('/gameBeginn',function(req,res){
    res.sendFile(__dirname + '/views/gameFirst.html');
});

app.get('/game', function(req, res){
    res.sendFile(__dirname + '/views/game.html');
});

// Aufrug für gameSchreiben
app.get('/gameSchreiben',function(req,res){
    res.sendFile(__dirname + '/views/gameSchreiben.html');
})

app.get("/chat", function(req, res){
    res.sendFile(__dirname + "/views/chat.html");

});

let wasZeichnen = " fliegende Kuh mit Krone"; // in diesen String setze was gezeichnet werden soll

app.get('/gameZeichnen',function(req,res){
    res.render("gameZeichnen",{"wasZeichnen": wasZeichnen});
})


//auskommentiert weil redundant
/*//Play-Button von Start
app.post("/play", function(req,res){    
    res.redirect("/login");
});*/

//Spielen-Button von Login
app.post("/playAngemeldet", function(req,res){    
    res.sendFile(__dirname + "/views/gameFirst.html");
});
app.post("/playLaufend", function(req,res){
    res.sendFile(__dirname + "/views/game.html")
});

/*
// POST von gameSchreiben
app.post("/gameSchreiben", function(req,res){
    const antwortGezeichnet= req.body.zeichnenAntwort; //hier wird die Antwort des Users drin gespeichert

    res.render("gameZeichnen",{"wasZeichnen": antwortGezeichnet});
    
    //console.log(antwortGezeichnet);


});*/
//auskommentiert weil nicht mit Datenbank verbunden und führt direkt zu nächster Runde desselben Games


//Anzeige der aktiven Runde und Inhalt aktiver Runde
app.post("/showRound", function(req,res){
    //Eingabe GameID
    param_gameID = req.body.input_gameID;
    //Datenbank Abruf aller Daten zu diesem Game
    db.all(`SELECT * FROM games WHERE gameID  = ${param_gameID}`, (err, row) => { 
        if (err) {
          res.send(err.message);
        } else if (row.length > 0) { //nur wenn es diese Zeile aka ein Game mit dieser GameID gibt
            // Result Row
            const result = row[0];
            // Values of retrieved columns
            const gameID = result.gameID;   
            const roundsPlayed = result.roundsPlayed;
            const activeRound = result.activeRound;

            if (roundsPlayed % 2 == 0){
                //Runde vorher gerade => Spiel einer UNgeraden Runde, also schreiben
                res.render("gameSchreiben", {"Game": gameID, "Runde": roundsPlayed +1, "filename": activeRound});

            } else {
                //Runde vorher ungerade => Spiel einer geraden Runde, also zeichnen
                res.render("gameZeichnen", {"Game": gameID, "Runde": roundsPlayed, "wasZeichnen": activeRound});
            }            
        } else {
            res.send("Fehler: Kein Game mit dieser ID gefunden.");
            //eventuell Weiterleitung auf newGame?
        }
    });
});

// Hier wird die Eingabe zu einem neuen Game aus dem Server in die db gespeichert 
app.post("/Runde1", function(req,res){   
    // Inhalt des Textfeldes 
    const Zeichnen= req.body.wasZeichnen;

    console.log(Zeichnen);
    //erstellt neue Zeile in games Tabelle mit einer gespielten Runde und dem Inhalt des Textfeldes
    db.run( `INSERT INTO games (roundsPlayed, round1, activeRound) VALUES (1, '${ Zeichnen } ', '${Zeichnen}')`, function(err){
        if (err){
            res.send(err.message)
        } else {
            //nach hochladen des neuen Games Weiterleitung auf Option, Laufende Games weiterzuspielen ==> eventuell eher auf LoginErfolgreich?
            res.sendFile(__dirname + "/views/game.html");
        }
    });
});

app.post("/zeichnenFertig", function(req,res){
    
    //Input aus Zeichnen-Runde in Variablen
    const param_gameID = req.body.gameID;
    const param_round = req.body.round-1;
    const param_newRound = req.body.round;
    const param_img =  testFilename; //TODO richtiger Aufruf des Inhalts der Canvas???
    console.log(testFilename); // nur zum testen

    //Einfügen der Werte in Datenbank-Zeile mit übergebener GameID
    db.run( `UPDATE TABLE games WHERE gameID ='${param_gameID}' 
    SET roundsPlayed=${param_newRound}, 
     round${param_round}='${param_img}',
     activeRound='${param_img}'`, function(err){
        if (err){
            res.send(err.message)
        } else {
            //Log der gespeicherten Werte und Weiterleitung auf Option, in weiteres laufendes Game einzusteigen => evtl Auswahl Neu/Laufend?
            console.log(`uploaded ${param_img} to round ${param_round} and set RP to ${param_newRound}`);
            res.sendFile(__dirname + "/views/game.html");
        }
    });
}); 

app.post("/gameSchreiben", function(req,res){

    //Input aus Schreiben-Runde in Variablen
    const param_gameID = req.body.gameID;
    const param_round = req.body.round-1;
    const param_newRound = req.body.round;
    const param_text = req.body.zeichnenAntwort;

    //Einfügen der Werte in Datenbank-Zeile mit übergebener GameID
    db.run( `UPDATE TABLE games WHERE gameID ='${param_gameID}' 
    SET roundsPlayed=${param_newRound}, 
     round${param_round}='${param_text}',
     activeRound='${param_text}'`, function(err){
        if (err){
            res.send(err.message)
        } else {
            //Log der gespeicherten Werte und Weiterleitung auf Option, in weiteres laufendes Game einzusteigen => evtl Auswahl Neu/Laufend?
            console.log(`uploaded ${param_text} to round ${param_round} and set RP to ${param_newRound}`);
            res.sendFile(__dirname + "/views/game.html");
        }
    });
});   


app.get("/spielen",function(req,res){
   res.sendFile(__dirname + "/views/upload_formular.html");
}) ;

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
                res.render("loginErfolgreich", {"benutzername": param_usernameInput});
            }
        });   
    } 
});
