const express = require("express");
const path = require("path");
let server = express();

class Server {
	constructor() {
		let PORT = 8080;

		//Überschreibt den Standardport Port 8080, falls beim Aufruf des Start-Scripts ein neuer als Parameter übergeben wurde (z. B. npm run start 2525)
		if (!isNaN(process.argv[2])) {
			PORT = process.argv[2];
		}

		server.use(express.static(path.join("./webapp/dist")));

		server.listen(PORT, () => { console.log("HTTP Server listening on port %d.", PORT); });
	}
}
let serverx = new Server();
