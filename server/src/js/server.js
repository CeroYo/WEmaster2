const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
let app = express();

/* ---- Benötigte eigene Klassen ---- */
const Sessions = require("./Sessions");
const ObservingObjects = require("./ObservingObjects");

let port = 8080;
const url = "localhost";
const BASE_URI = `http://${url}:${port}`;

//Überschreibt den Standardport Port 8080, falls beim Aufruf des Start-Scripts ein neuer als Parameter übergeben wurde (z. B. npm run start 2525)
if (!isNaN(process.argv[2])) {
	port = process.argv[2];
}

app.use(express.static(path.join("./webapp/dist")));

app.listen(port, () => { console.log("HTTP Server listening on port %d.", port); });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("", (request, response) => {
	response.json({
		_links: {
			self: { href: `${BASE_URI}` },
			sessions: { href: `${BASE_URI}/sessions` },
			observingObjects: { href: `${BASE_URI}/observingObjects` },
		}
	});
});

/* ---- Requests Sessions ---- */

app.get("/sessions", (request, response) => {
	response.json(createSessionListResponseBody());
});

function createSessionListResponseBody() {
	return {
		sessions: Sessions.getAll(),
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
}

app.get("/sessions/:id", (request, response) => {
	let id = request.params.id;
	if (!Sessions.exists(id)) {
		response.sendStatus(404);
	}
	else {
		response.json(createSessionResponseBody(id));
	}
});

app.put("/sessions/:id", (request, response) => {
	let id = request.params.id;
	let updatedSession = request.body;

	if (!Sessions.exists(id)) {
		response.sendStatus(404);
	}
	else if (!(updatedSession.name && updatedSession.date && updatedSession.location)) {
		response.sendStatus(400);
	}
	else {
		Sessions.update(id, updatedSession.name, updatedSession.date, updatedSession.location);
		response.json(createSessionResponseBody(id));
	}
});

function createSessionResponseBody(id) {
	return Sessions.get(id);
}

app.delete("/sessions/:id", (request, response) => {
	let id = request.params.id;

	if (!Sessions.exists(id)) {
		response.sendStatus(404);
	}
	else {
		Sessions.delete(id);
		response.json(createSessionListResponseBody);
	}
});

app.post("/sessions", (request, response) => {
	let newSession = request.body;

	if (!(newSession.name && newSession.date && newSession.location)) {
		response.sendStatus(400);
	}
	else {
		let id = Sessions.create(newSession.name, newSession.date, newSession.location, newSession.observingObject);
		response.location(`${BASE_URI}/sessions/${id}`).status(201).json(createSessionResponseBody(id));
	}
});

/* ---- Requests observingObjects --- */
app.get("/observingObjects", (request, response) => {
	response.json(createObservingObjectListResponseBody());
});

function createObservingObjectListResponseBody() {
	return {
		observingObjects: ObservingObjects.getAll(),
		_links: {
			self: {
				href: `${BASE_URI}/observingObjects`
			},
			create: {
				method: "POST",
				href: `${BASE_URI}/observingObjects`
			}
		}
	};
}

app.get("/observingObjects/:id", (request, response) => {
	let id = request.params.id;
	if (!ObservingObjects.exists(id)) {
		response.sendStatus(404);
	}
	else {
		response.json(createObservingObjectResponseBody(id));
	}
});

app.put("/observingObjects/:id", (request, response) => {
	let id = request.params.id;
	let updatedObject = request.body;

	if (!ObservingObjects.exists(id)) {
		response.sendStatus(404);
	}
	else if (!(updatedObject.name && updatedObject.sessionId)) {
		response.sendStatus(400);
	}
	else {
		ObservingObjects.update(id, updatedObject.sessionId, updatedObject.name);
		response.json(createObservingObjectResponseBody(id));
	}
});

function createObservingObjectResponseBody(id) {
	return ObservingObjects.get(id);
}

app.delete("/observingObjects/:id", (request, response) => {
	let id = request.params.id;

	if (!ObservingObjects.exists(id)) {
		response.sendStatus(404);
	}
	else {
		ObservingObjects.delete(id);
		response.json(createObservingObjectListResponseBody);
	}
});

app.post("/observingObjects", (request, response) => {
	let newObject = request.body;

	if (!(newObject.name && newObject.sessionId)) {
		response.sendStatus(400);
	}
	else {
		let id = ObservingObjects.create(newObject.sessionId, newObject.name);
		response.location(`${BASE_URI}/observingObject/${id}`).status(201).json(createObservingObjectResponseBody(id));
	}
});

module.exports = app;
