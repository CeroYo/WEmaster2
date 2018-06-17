const express = require("express");
const path = require("path");
let server = express();

class Server {
	constructor() {
		let PORT = 8080;

		if (!isNaN(process.argv[3])) {
			PORT = process.argv[3];
		}

		server.use(express.static(path.join(process.argv[2])));

		server.listen(PORT, () => { console.log("HTTP Server listening on port %d.", PORT); });
	}
}
let serverx = new Server();
