const fs = require("fs");
const OBJECTS_PATH = "./server/observingObjects/observingObjects.json";
const OBJECT_PATH = "./server/observingObject/";
const SESSIONS_PATH = "./server/savedSessions/sessions.json";
const SESSION_PATH = "./server/savedSessions/";

class ObservingObjects {
	constructor() {
		this.observingObjects = [];
		this._readObjects();
	}

	//private Methode
	_readObjects() {
		try {
			let readData = fs.readFileSync(OBJECTS_PATH);
			this.observingObjects = JSON.parse(readData).observingObjects;
			console.log("ObservingObjects Daten gelesen.");
		}
		catch (error) {
			console.log(error);
		}
	}

	getAll() {
		return this.observingObjects;
	}

	get(id) {
		try {
			let session = fs.readFileSync(SESSION_PATH + this.observingObjects.indexOf(id) + ".json");
			return session;
		}
		catch (error) {
			console.log(error);
		}
		return this.observingObjects[id];
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
		let objectId = this.observingObjects.length;
		this.observingObjects.push({ href: OBJECT_PATH + objectId });
		this.saveObject(OBJECTS_PATH, JSON.stringify({ observingObjects: this.observingObjects }));

		let objectToSave = {
			observingObject: {
				session: {
					href: SESSION_PATH + sessionId
				},
				name: `${name}`
			}
		};
		this.saveObject(OBJECTS_PATH + objectId + ".json", JSON.stringify(objectToSave, null, 4));
	}

	update(sessionId, name) {
		//
	}

	delete() {
		//
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
