/* -------- BEGIN IMPORTS -------- */
//Schnittstelle des Servers
const Server = require("./Server");

//Bieten Funktionen zum Speichern und Löschen von Sessions
const SessionManager = require("./SessionManager");

//Objekt für eine Beobachtungsession
const ObservingSession = require("./ObservingSession");

/* -------- BEGIN CODE -------- */
let server = new Server();
server.start();

//Es wird nur ein Objekt benötig, dieses liest am Anfang einmalig Daten aus der Datei
//und schreibt dann immer Änderungen in die Datei.
let sessions = new SessionManager();
