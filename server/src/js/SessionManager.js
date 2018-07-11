const ObservingSession = require("./ObservingSession.js");
const fs = require("fs");
const FILE = "./server/savedSessions/sessions.json";

//Stellt eine Wrapperklasse zum speichern der Sessions dar
class SessionManager {
	constructor() {
		this.lastEdited = new Date();
		this.data = [];

		//read object from file
		this._getSession();
	}

	//private Methode
	_getSession() {
		try {
			let tmp = fs.readFileSync(FILE);
			let parsedData = JSON.parse(tmp);
			this.lastEdited = parsedData.lastEdited;
			this.data = parsedData.data;
			console.log("Daten gelesen.");
		}
		catch (error) {
			console.log(error);
		}
	}

	//speichert daten; noch nicht betrachten was passieren soll, falls daten gleich sind
	saveSession(observingSession) {
		try {
			this.lastEdited = new Date();
			if (observingSession !== null) {
				this.data.push(observingSession);
				console.log("Daten: " + observingSession.name + ", " + observingSession.date + ", " + observingSession.location + " wurden gespeichert.");
			}

			fs.writeFileSync(FILE, JSON.stringify(this, null, 4));
		}
		catch (error) {
			console.error(error);
		}
	}

	deleteSession(observingSession) {
		try {
			//suche in data nach element welches gelöscht werden soll
			this.data.forEach(function (element, index, arr) {
				if (element.name === observingSession.name && Date.parse(element.date) === Date.parse(observingSession.date) && element.location === observingSession.location) {
					arr.splice(index, 1);
					this.saveSession(null);
					console.log("Daten: " + element.name + ", " + element.date + ", " + element.location + " wurden gelöscht.");
				}
			}, this);
		}
		catch (error) {
			console.log(error);
		}
	}
}

module.exports = SessionManager;

let o = new ObservingSession("my", "11.07.2018", "mylocation23", "myObservingObject2");
let s = new SessionManager();
s.saveSession(o);
s.deleteSession(o);
