const fs = require("fs");
const observingObject = require("./ObservingObjects");
const SESSIONS_PATH = "./server/savedSessions/sessions.json";
const SESSION_PATH = "./server/savedSessions/";
const OBSERVING_OBJECTS_PATH = "./server/observingObject/observingObject.json";
const OBSERVING_OBJECT_PATH = "./server/observingObject/";
const SESSION_LINKS = {
	self: {
		href: "http://localhost:8080/sessions/:id"
	},
	list: {
		href: "http://localhost:8080/sessions"
	},
	update: {
		method: "PUT",
		href: "http://localhost:8080/sessions/:id"
	},
	delete: {
		method: "DELETE",
		href: "http://localhost:8080/sessions/:id"
	}
};

const SESSIONS_LINKS = {
	self: {
		href: "http://localhost:8080/sessions"
	},
	create: {
		method: "POST",
		href: "http://localhost:8080/sessions"
	}
};

class Sessions {
	constructor() {
		this.id = 0;
		this.sessions = {};
		this.observingObjects = [];
		this._readSessions();
	}

	//private Methode
	_readSessions() {
		try {
			let readData = fs.readFileSync(SESSIONS_PATH);
			this.sessions = JSON.parse(readData).sessions;
			this.id = JSON.parse(readData).id + 1;

			readData = fs.readFileSync(OBSERVING_OBJECTS_PATH);
			this.observingObjects = JSON.parse(readData).observingObjects;

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
				try {
					let session = fs.readFileSync(SESSION_PATH + id + ".json");
					return session;
				}
				catch (error) {
					console.log(error);
				}
			}
		}
		return {};
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

	//Erzeugt neue Session; Noch nicht betrachtet wenn Daten gleich sind
	create(name, date, location, observingObjects) {
		this.id++;
		this.sessions.id = { href: "http://localhost:8080/sessions/${this.id}" };
		let sessionsToSave = {
			id: this.id,
			sessions: this.sessions,
			_links: SESSIONS_LINKS
		};
		this.saveSession(SESSIONS_PATH, JSON.stringify(sessionsToSave, null, 4));

		let sessionToSave = {
			session: {
				name: `${name}`,
				date: `${date}`,
				location: `${location}`
			},
			_links: SESSION_LINKS
		};
		this.saveSession(SESSION_PATH + this.id + ".json", JSON.stringify(sessionToSave, null, 4));

		for (let object in observingObjects) {
			//this.observingObjects.push(new ObservingObject());
		}

		return this.id;
	}

	update(id, name, date, location, observingObjects) {

		this.sessions.id = {};
	}

	delete(id) {
		delete this.sessions[id];
		this.saveSession();
	}

	saveSession(path, data) {
		try {
			fs.writeFileSync(path, data);
		}
		catch (error) {
			console.error(error);
		}
	}
}

module.exports = new Sessions();
