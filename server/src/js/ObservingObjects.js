const fs = require("fs");
const OBJECTS_PATH = "./server/observingObjects/observingObjects.json";
const OBJECT_PATH = "./server/observingObjects/";
const SESSIONS_PATH = "./server/sessions/sessions.json";
const SESSION_PATH = "./server/sessions/";

let port = 8080;
const url = "localhost";
const BASE_URI = `http://${url}:${port}`;

class ObservingObjects {
	constructor() {
		this.id = 0;
		this.observingObjects = {};
		this._readObjects();
	}

	//private Methode
	_readObjects() {
		try {
			let readData = fs.readFileSync(OBJECTS_PATH);
			this.observingObjects = JSON.parse(readData).observingObjects;
			this.id = JSON.parse(readData).id;
			console.log("ObservingObjects Daten gelesen.");
		}
		catch (error) {
			console.log(error);
		}
	}

	getAll() {
		return this.observingObjects;
	}

	getBySessionId(sessionId) {
		let returnObject = {};
		for (let key in this.observingObjects) {
			if (!this.observingObjects.hasOwnProperty(key)) { continue; }

			if (parseInt(this.observingObjects[key].sessionId) === parseInt(sessionId)) {
				returnObject[key] = this.observingObjects[key];
			}
		}
		return returnObject;
	}

	get(id) {
		let readData = fs.readFileSync(OBJECT_PATH + id + ".json");
		return JSON.parse(readData);
	}

	exists(id) {
		if (this.observingObjects[id] !== undefined && this.observingObjects[id] !== null) {
			return true;
		}
		else {
			return false;
		}
	}

	create(sessionId, name) {
		let objectToSave = {
			observingObject: {
				session: {
					href: `${BASE_URI}/sessions/${sessionId}`
				},
				name: `${name}`
			}
		};
		this.saveObject(OBJECT_PATH + this.id + ".json", JSON.stringify(objectToSave, null, 4));

		this.observingObjects[this.id] = {
			href: `${BASE_URI}/observingObject/${this.id}`,
			sessionId: sessionId
		};
		this.id++;
		let objectsToSave = {
			id: this.id,
			observingObjects: this.observingObjects
		};

		this.saveObject(OBJECTS_PATH, JSON.stringify(objectsToSave, null, 4));
	}

	update(id, sessionId, name) {
		let objectToSave = {
			observingObject: {
				session: {
					href: SESSION_PATH + sessionId
				},
				name: `${name}`
			}
		};
		this.saveObject(OBJECT_PATH + id + ".json", JSON.stringify(objectToSave, null, 4));
	}

	delete(id) {
		console.log("Deleting " + id);
		delete this.observingObjects[id];
		this.id--;
		let objectsToSave = {
			id: this.id,
			observingObjects: this.observingObjects
		};
		this.saveObject(OBJECTS_PATH, JSON.stringify(objectsToSave, null, 4));
		fs.unlinkSync(OBJECT_PATH + id + ".json");
		console.log("Deleting finished");
	}

	saveObject(path, data) {
		try {
			fs.writeFileSync(path, data);
		}
		catch (error) {
			console.error(error);
		}
	}
}

module.exports = new ObservingObjects();
