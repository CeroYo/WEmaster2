const express = require("express");
const path = require("path");
let server = express();

const fs = require("fs");

let htmlData = "";
let cssData = "";
let jsData = "";

module.exports = class Server{
    constructor(){
        try {
            // htmlData = fs.readFileSync("dist/index.html");
            // htmlData = htmlData.toString();
            // console.log(htmlData);

            // cssData = fs.readFileSync("dist/style.css");
            // cssData = cssData.toString();
            // console.log(cssData);

            // jsData = fs.readFileSync("dist/main.js");
            // jsData = jsData.toString();
            // console.log(jsData);
        }
        catch(error) {
            console.error(error);
        }

        // server.get("/", (request, response) => {
        //     response.send(htmlData);
        // })

        // //Zum testen von verschiedenen GET-Anfragen
        // server.get("/json", (request, response) => {
        //     response.json({
        //         message: "Hello, World!",
        //         success: true
        //     });
        // });

        // //Zum testen von verschiedenen GET-Anfragen
        // server.get("/XXX", (request, response) => {
        //     response.sendStatus(404);
        //  });

        let PORT = 8080;

        //Falls Parameter nach "npm run start" eine Nummer ist wird der Port überschrieben
        if (!isNaN(process.argv[2])){
            PORT = process.argv[2];
        }
        

        server.use(express.static(path.join("dist")));

        server.listen(PORT, () => {console.log("HTTP Server listening on port %d.", PORT)});
    }
}