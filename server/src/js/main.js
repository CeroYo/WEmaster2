const express = require("express");
const path = require("path");
let server = express();

const fs = require("fs");

let htmlData = "";
let cssData = "";
let jsData = "";

module.exports = class Server{
    constructor(){

        let PORT = 8080;

        //Falls Parameter nach "npm run start" eine Nummer ist wird der Port überschrieben
        if (!isNaN(process.argv[2])){
            PORT = process.argv[2];
        }
        
        server.use(express.static(path.join("./webapp/dist")));

        server.listen(PORT, () => {console.log("HTTP Server listening on port %d.", PORT)});
    }
}