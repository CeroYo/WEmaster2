const express = require("express");
const path = require("path");
let server = express();

class Server {
	constructor() {
		this.PORT = 8080;

		//Überschreibt den Standardport Port 8080, falls beim Aufruf des Start-Scripts ein neuer als Parameter übergeben wurde (z. B. npm run start 2525)
		if (!isNaN(process.argv[2])) {
			this.PORT = process.argv[2];
		}

		server.use(express.static(path.join("./webapp/dist")));
	}

	start() {
		server.listen(this.PORT, () => { console.log("HTTP Server listening on port %d.", this.PORT); });
	}
}

module.exports = Server;
