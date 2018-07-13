const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
let server = express();

/* ---- Benötigte eigene Klassen ---- */
const Sessions = require("./Sessions");

let port = 8080;
const BASE_URI = "http://localhost:${port}";

//Überschreibt den Standardport Port 8080, falls beim Aufruf des Start-Scripts ein neuer als Parameter übergeben wurde (z. B. npm run start 2525)
if (!isNaN(process.argv[2])) {
	port = process.argv[2];
}

server.use(express.static(path.join("./webapp/dist")));

server.listen(port, () => { console.log("HTTP Server listening on port %d.", port); });

server.use(bodyParser.json());

server.get("", (request, response) => {
	response.json({
		_links: {
			self: { href: `${BASE_URI}` },
			sessions: { href: `${BASE_URI}/sessions` },
			observingObject: { href: `${BASE_URI}/observingObject` },
		}
	});
});

server.get("/sessions", (request, response) => {
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

server.get("/sessions/:id", (request, response) => {
	let id = request.params.id;
	if (!Sessions.exists(id)) {
		response.sendStatus(404);
	}
	else {
		response.json(createSessionResponseBody(id));
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

server.delete("/sessions/:id", (request, response) => {
	let id = request.params.id;

	if (!Sessions.exists(id)) {
		response.sendStatus(404);
	}
	else {
		Sessions.delete(id);
		response.json(createSessionListResponseBody);
	}
});

server.post("/sessions", (request, response) => {
	let newSession = request.body;

	if (!(newSession.name && newSession.date && newSession.location && newSession.observingObject)) {
		response.sendStatus(400);
	}
	else {
		let id = Sessions.create(newSession.name, newSession.date, newSession.location, newSession.observingObject);
		response.location("${BASE_URI}/sessions/${id}").status(201).json(createSessionResponseBody(id));
	}
});

module.exports = server;
