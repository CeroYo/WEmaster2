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
		let returnArray = [];
		for (let object in this.observingObjects) {
			if (object.sessionId === sessionId) {
				returnArray.push(object);
			}
		}
		return returnArray;
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
					href: `${BASE_URI}/observingObjects/${this.id}`
				},
				name: `${name}`
			}
		};
		this.saveObject(OBJECT_PATH + this.id + ".json", JSON.stringify(objectToSave, null, 4));

		//TODO: Cannot set property '3' of undefined
		this.observingObjects[this.id] = {
			href: OBJECT_PATH + this.id + ".json",
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
		delete this.observingObjects[id];
		this.saveObject(OBJECTS_PATH, JSON.stringify(this.observingObjects));
		fs.unlinkSync(OBJECT_PATH + id + ".json");
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
