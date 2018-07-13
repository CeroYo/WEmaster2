const fs = require("fs");
const ObservingObject = require("./ObservingObjects");
const SESSIONS_PATH = "./server/sessions/sessions.json";
const SESSION_PATH = "./server/sessions/";
const OBSERVING_OBJECTS_PATH = "./server/observingObjects/observingObjects.json";
const OBSERVING_OBJECT_PATH = "./server/observingObjects/";

let port = 8080;
const url = "localhost";
const BASE_URI = `http://${url}:${port}`;

class Sessions {
	constructor() {
		this.id = 0;
		this.sessions = {};
		this._readSessions();
	}

	//private Methode
	_readSessions() {
		try {
			let readData = fs.readFileSync(SESSIONS_PATH);
			this.sessions = JSON.parse(readData).sessions;
			this.id = JSON.parse(readData).id + 1;

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
					let session = JSON.parse(fs.readFileSync(SESSION_PATH + id + ".json"));
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
		return this.sessions.hasOwnProperty(id);
	}

	//Erzeugt neue Session; Noch nicht betrachtet wenn Daten gleich sind
	create(name, date, location, observingObjects) {
		let sessionToSave = {
			session: {
				name: `${name}`,
				date: `${date}`,
				location: `${location}`
			},
			_links: {
				self: {
					href: `http://${BASE_URI}/sessions/:id`
				},
				list: {
					href: `http://${BASE_URI}/sessions`
				},
				update: {
					method: "PUT",
					href: `http://${BASE_URI}/sessions/:id`
				},
				delete: {
					method: "DELETE",
					href: `http://${BASE_URI}/sessions/:id`
				}
			}
		};
		this.saveSession(SESSION_PATH + this.id + ".json", JSON.stringify(sessionToSave, null, 4));

		this.sessions[this.id] = { href: `http://${BASE_URI}/sessions/${this.id}` };
		this.id++;
		let sessionsToSave = {
			id: this.id,
			sessions: this.sessions,
			_links: {
				self: {
					href: `http://${BASE_URI}/sessions`
				},
				create: {
					method: "POST",
					href: `http://${BASE_URI}/sessions`
				}
			}
		};
		this.saveSession(SESSIONS_PATH, JSON.stringify(sessionsToSave, null, 4));

		//for (let objectName in observingObjects) {
		ObservingObject.create(this.id, observingObjects);
		//}

		return this.id;
	}

	update(id, name, date, location, observingObjects) {
		//
		this.sessions.id = {};
	}

	delete(id) {
		delete this.sessions[id];
		for (let object in ObservingObject.getBySessionId(id)) {
			ObservingObject.delete(object.id);
		}
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
