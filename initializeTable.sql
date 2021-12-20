/*
initialisiert komplette Datenbank,
wird geladen mit
sqlite> .read quitinitializeTables.sql
*/

/*
Usertabelle mit allen Werten für Registrierung und einem BehilfsBool für Player/Zuschauer.
*/

CREATE TABLE users (
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    player INTEGER(1) /*SQLite hat kein Boolean*/
    );

/*
Gamestabelle mit den gespielten Runden, einem Booleanersatz ob es aktiv ist oder nicht (da muss dann noch die Methode dran wenn die Rundenzahl 7 erreicht ist)
und einer Verlinkung für 4 Spieler, denke das sollte reichen
*/

CREATE TABLE games (
    gameID INTEGER PRIMARY KEY AUTOINCREMENT,   
    roundsPlayed INTEGER(1) NOT NULL, 
    active INTEGER(1),   
    round1 TEXT,
    round2 TEXT,
    round3 TEXT,
    round4 TEXT,
    round5 TEXT,
    round6 TEXT,
    round7 TEXT
    );

    /*
    TODO: Runden mit geraden Zahlen Bilder --> Link in images Ordner = normaler Text?
    */

/*
Chattabelle mit gesendeten Nachrichten, soll auf Startseite für User angezeigt werden
*/

CREATE TABLE chat (
    msgID INTEGER PRIMARY KEY AUTOINCREMENT,
    sentBy INTEGER NOT NULL,
    msgText TEXT NOT NULL,
    msgTime TEXT,
    FOREIGN KEY(sentBy) REFERENCES users(userID)
);

/*Testwerte einfügen*/

INSERT INTO users (name, password, player) VALUES ("Alice", "§$Y45/912v", 1);
INSERT INTO users (name, password, player) VALUES ("Bob", "secret", 1);
INSERT INTO users (name, password, player) VALUES ("Carla", "123", 1);
INSERT INTO users (name, password, player) VALUES ("David", "divaD", 1);
INSERT INTO users (name, password, player) VALUES ("Maria17", "123qwerty", 1);
INSERT INTO users (name, password, player) VALUES ("SpeckiSpectator", "lurking1sFun", 0);

INSERT INTO games (roundsPlayed, active) VALUES (0, 1);
INSERT INTO games (roundsPlayed, active, round1, round2) VALUES (2, 1, "Schwein", "images/gameIDrunde2");
INSERT INTO games (roundsPlayed, active, round1, round2, round3, round4, round5, round6, round7) VALUES (7, 0, "Haus", "images/gameIDrunde2", "Haus", "images/gameIDrunde4", "Haus", "images/gameIDrunde6", "Hund");

INSERT INTO chat (sentBy, msgText) VALUES (3, "Hi guys!");
INSERT INTO chat (sentBy, msgText) VALUES (1, "Hallo zusammen");
INSERT INTO chat (sentBy, msgText) VALUES (4, "SpamSpamSpamSpam");
