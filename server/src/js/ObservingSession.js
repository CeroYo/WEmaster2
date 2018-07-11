const fs = require("fs");

class ObservingSession {
	constructor(name, date, location, observingObjects = []) {
		this.name = name;
		this.date = new Date(date);
		this.location = location;
		this.observingObjects = observingObjects;
	}

	editName(newName) {
		this.name = newName;
	}

	editDate(newDate) {
		this.date = new Date(newDate);
	}

	editLocation(newLocation) {
		this.location = newLocation;
	}

	addObservingObject(observingObject) {
		this.observingObjects.push(observingObject);
	}

	removeObservingObject(observingObject) {
		let index = this.observingObjects.indexOf(observingObject);
		if (index > 0) {
			this.observingObjects.splice(index, 1);
		}
	}
}

module.exports = ObservingSession;

var o = new ObservingSession("blub", "11.07.2018", "da");

//o.addObservingObject("Hallo");
//o.editLocation("hier");
