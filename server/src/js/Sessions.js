const fs = require("fs");
const ObservingSession = require("./ObservingSession");
const FILE = "./server/savedSessions/mod-sessions.json";

class Sessions {
	constructor() {
		this.sessions = {};
		this.id = 0;
		this._readSessions();
	}

	//private Methode
	_readSessions() {
		try {
			let tmp = fs.readFileSync(FILE);
			let parsedData = JSON.parse(tmp).sessions;
			this.sessions = parsedData;
			//hoechste ID
			let count = 0;
			for (var key in this.sessions) {
				// skip loop if the property is from prototype
				if (!this.sessions.hasOwnProperty(key)) { continue; }
				count++;
			}
			this.id = count;
			console.log("Daten gelesen.");
		}
		catch (error) {
			console.log(error);
		}
	}

	getAll() {
		return this.sessions;
	}

	get(id) {
		for (var key in this.sessions) {
			// skip loop if the property is from prototype
			if (!this.sessions.hasOwnProperty(key)) { continue; }

			if (key === id) {
				console.log(this.sessions.id);
				return this.sessions.id;
			}
		}
		return {};
	}

	delete(id) {
		delete this.sessions[id];
	}

	exists(id) {
		/*
		for (var key in this.sessions) {
			// skip loop if the property is from prototype
			if (!parsedData.hasOwnProperty(key)) { continue; }

			var obj = parsedData[key];
			for (var prop in obj) {
				// skip loop if the property is from prototype
				if (!obj.hasOwnProperty(prop)) { continue; }

				// your code
				console.log(prop + " = " + obj[prop]);
				this.sessions[obj.key] = prop;
			}
		}*/
		for (var key in this.sessions) {
			// skip loop if the property is from prototype
			if (!this.sessions.hasOwnProperty(key)) { continue; }

			console.log(key + " === " + id);
			if (key === id) {
				return true;
			}
		}
		return false;
	}

	create(name, date, location, observingSession) {
		this.id++;
		let o = new ObservingSession(this.id, name, date, location, observingSession);
		//TODO observingSession.json
		this.sessions.id = { href: "http://localhost:8080/sessions/${this.id}" };
		return o.id;
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

module.exports = new Sessions();
