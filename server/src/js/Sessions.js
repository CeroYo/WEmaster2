const fs = require("fs");
const ObservingObject = require("./ObservingObjects");
const SESSIONS_PATH = "./server/sessions/sessions.json";
const SESSION_PATH = "./server/sessions/";

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
			this.id = JSON.parse(readData).id;

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
		let currentId = this.id;
		let sessionToSave = {
			session: {
				name: `${name}`,
				date: `${date}`,
				location: `${location}`
			},
			_links: {
				self: {
					href: `${BASE_URI}/sessions/:id`
				},
				list: {
					href: `${BASE_URI}/sessions`
				},
				update: {
					method: "PUT",
					href: `${BASE_URI}/sessions/:id`
				},
				delete: {
					method: "DELETE",
					href: `${BASE_URI}/sessions/:id`
				}
			}
		};
		this.saveSession(SESSION_PATH + currentId + ".json", JSON.stringify(sessionToSave, null, 4));

		this.sessions[currentId] = { href: `${BASE_URI}/sessions/${currentId}` };
		this.id++;
		let sessionsToSave = {
			id: this.id,
			sessions: this.sessions,
			_links: {
				self: {
					href: `${BASE_URI}/sessions`
				},
				create: {
					method: "POST",
					href: `${BASE_URI}/sessions`
				}
			}
		};
		this.saveSession(SESSIONS_PATH, JSON.stringify(sessionsToSave, null, 4));

		ObservingObject.create(currentId, observingObjects);

		return currentId;
	}

	update(id, name, date, location) {
		let sessionToSave = {
			session: {
				name: `${name}`,
				date: `${date}`,
				location: `${location}`
			},
			_links: {
				self: {
					href: `${BASE_URI}/sessions/:id`
				},
				list: {
					href: `${BASE_URI}/sessions`
				},
				update: {
					method: "PUT",
					href: `${BASE_URI}/sessions/:id`
				},
				delete: {
					method: "DELETE",
					href: `${BASE_URI}/sessions/:id`
				}
			}
		};
		this.saveSession(SESSION_PATH + id + ".json", JSON.stringify(sessionToSave, null, 4));

		this.sessions[id] = { href: `${BASE_URI}/sessions/${id}` };
		let sessionsToSave = {
			id: this.id,
			sessions: this.sessions,
			_links: {
				self: {
					href: `${BASE_URI}/sessions`
				},
				create: {
					method: "POST",
					href: `${BASE_URI}/sessions`
				}
			}
		};
		this.saveSession(SESSIONS_PATH, JSON.stringify(sessionsToSave, null, 4));
	}

	delete(id) {
		delete this.sessions[id];
		this.id--;
		let sessionsToSave = {
			id: this.id,
			sessions: this.sessions,
			_links: {
				self: {
					href: `${BASE_URI}/sessions`
				},
				create: {
					method: "POST",
					href: `${BASE_URI}/sessions`
				}
			}
		};
		this.saveSession(SESSIONS_PATH, JSON.stringify(sessionsToSave, null, 4));
		fs.unlinkSync(SESSION_PATH + id + ".json");
		let objects = ObservingObject.getBySessionId(id);
		for (let key in objects) {
			ObservingObject.delete(key);
		}
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
