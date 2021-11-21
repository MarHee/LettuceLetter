/*
initialisiert komplette Datenbank,
wird geladen mit
sqlite> .read initializeTables.sql
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
    roundsPlayed INTEGER NOT NULL, 
    active INTEGER(1),   
    player1 INTEGER,   
    player2 INTEGER,   
    player3 INTEGER,   
    player4 INTEGER,   
    FOREIGN KEY(player1) REFERENCES users(userID), 
    FOREIGN KEY(player2) REFERENCES users(userID),   
    FOREIGN KEY(player3) REFERENCES users(userID), 
    FOREIGN KEY(player4) REFERENCES users(userID)    
    );

/*Testwerte einfügen*/

INSERT INTO users (name, password, player) VALUES ("Alice", "§$Y45/912v", 1);
INSERT INTO users (name, password, player) VALUES ("Bob", "secret", 1);
INSERT INTO users (name, password, player) VALUES ("Carla", "123", 1);
INSERT INTO users (name, password, player) VALUES ("David", "divaD", 1);
INSERT INTO users (name, password, player) VALUES ("Maria17", "123qwerty", 1);
INSERT INTO users (name, password, player) VALUES ("SpeckiSpectator", "lurking1sFun", 0);

INSERT INTO games (roundsPlayed, active, player1, player2, player3, player4) VALUES (2, 1, 2, 5);
INSERT INTO games (roundsPlayed, active, player1, player2, player3, player4) VALUES (6, 1, 2, 5, 4, 3);
INSERT INTO games (roundsPlayed, active, player1, player2, player3, player4) VALUES (7, 0, 1, 3, 2, 5);