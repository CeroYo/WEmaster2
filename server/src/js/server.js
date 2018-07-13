const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
let app = express();

/* ---- Benötigte eigene Klassen ---- */
const Sessions = require("./Sessions");
const ObservingObjects = require("./ObservingObjects");

let port = 8080;
const BASE_URI = "http://localhost:${port}";

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

app.get("/sessions", (request, response) => {
	response.json(createSessionListResponseBody());
});

function createSessionListResponseBody() {
	return {
		sessions: Sessions.getAll(),
		_links: {
			self: { href: "${BASE_URI}/sessions" },
			create: {
				method: "POST",
				href: "${BASE_URI}/sessions"
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

	if (!Sessions.exists(id)) {
		response.sendStatus(404);
	}
	else {
		let updatedSession = request.body;
		Sessions.update(id, updatedSession.name, updatedSession.date, updatedSession.location, updatedSession.observingObjects);
		response.json(createSessionResponseBody);
	}
});

function createSessionResponseBody(id) {
	let responseBody = {
		_links: {
			self: { href: "${BASE_URI}/sessions/${id}" }
		},
		list: {
			href: "${BASE_URI}/sessions"
		}
	};

	responseBody.sessions = Sessions.get(id);

	responseBody._links.update = {
		method: "PUT",
		href: "${BASE_URI}/sessions/${id}"
	};

	responseBody._links.delete = {
		method: "DELETE",
		href: "${BASE_URI}/sessions/${id}"
	};

	return responseBody;
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

	if (!(newSession.name && newSession.date && newSession.location && newSession.observingObject)) {
		response.sendStatus(400);
	}
	else {
		let id = Sessions.create(newSession.name, newSession.date, newSession.location, newSession.observingObject);
		response.location("${BASE_URI}/sessions/${id}").status(201).json(createSessionResponseBody(id));
	}
});

module.exports = app;
