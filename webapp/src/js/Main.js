const PORT = 8080;
const BASE_URI = `http://localhost:${PORT}/`;

let sessionsJSON = {};

document.onload = loadTable();

function loadTable() {
	//Tabelle leeren
	document.getElementById("table").innerHTML = "<thead><tr id=\"th\"><th>Sitzung</th><th>Datum</th><th>Ort</th></tr></thead>";
	//Sessiondaten anfragen
	let request = new XMLHttpRequest();
	request.addEventListener("load", () => createList(request.response));
	request.open("GET", BASE_URI + "sessions");
	request.responseType = "json";
	request.send();
	if (!document.getElementById("sitzungsanzeige").classList.contains("invisible")) {
		let sessionId = Object.keys(sessionsJSON)[selectedNr - 1];
		hideSessionDetails();
		showSessionDetails(sessionsJSON[sessionId].href, sessionId);
	}
	function createList(response) {
		sessionsJSON = response.sessions;

		console.log(sessionsJSON);
		let sessionsArr = [];
		for (let i = 0; i < Object.keys(sessionsJSON).length; i++) {
			let keyValue = Object.keys(sessionsJSON)[i];
			console.log(keyValue);
			if (!sessionsJSON.hasOwnProperty(keyValue)) { continue; }
			sessionsArr.push({ key: keyValue, json: sessionsJSON[keyValue] });
		}

		sessionsArr.sort(function (a, b) {
			return a.key - b.key;
		});

		console.log(sessionsArr);

		//Tabellenhöhe
		let docHeight = window.innerHeight - 100;
		let numberTableElements = Math.round(docHeight / document.getElementById("th").clientHeight);
		let numberOfPages = Object.keys(sessionsJSON).length;
		console.log(document.body.clientHeight);
		console.log(numberTableElements);
		console.log(numberOfPages);
		let count = 0;
		for (let i = 0; i < sessionsArr.length; i++) {
			if (count < numberTableElements) {
				let request2 = new XMLHttpRequest();
				request2.addEventListener("load", () => {
					let row = document.createElement("tr");
					let cell1 = document.createElement("td");
					let cell2 = document.createElement("td");
					let cell3 = document.createElement("td");
					cell1.textContent = request2.response.session.name;
					row.appendChild(cell1);
					cell2.textContent = request2.response.session.date;
					row.appendChild(cell2);
					cell3.textContent = request2.response.session.location;
					row.appendChild(cell3);
					row.addEventListener("click", select);
					document.getElementById("table").appendChild(row);
					//document.createElement("<input type=\"button\" id=\"zurueck\" name=\"zurueck\" value=\"<\" class=\"pure-button pagination-button\" />");
					//document.getElementById("table").parentElement.appendChild("<input type=\"button\" id=\"pageOne\" name=\"pageOne\" value=\"1\" class=\"pure-button pagination-button\" /><input type =\"button\" id=\"zurueck\" name=\"zurueck\" value=\">\" class=\"pure-button pagination-button\" />");
				});
				console.log(i);
				console.log(sessionsArr[i].json.href);
				request2.open("GET", sessionsArr[i].json.href);
				request2.responseType = "json";
				request2.send();
			}
			count++;
		}
	}
}

// Selectioncolor; Funktioniert nicht bei Feldern mit vorher definierten Feldern
let table = document.getElementById("table");
let selected = false;
let selectedNr;
function select() {
	if (this.id !== "th" && this.className === "" && selected === false) {
		this.className += "select";
		selectedNr = this.rowIndex;
		selected = true;
		let sessionId = Object.keys(sessionsJSON)[selectedNr - 1];
		showSessionDetails(sessionsJSON[sessionId].href, sessionId);
	}
	else if (this.id !== "th" && this.className === "" && selected === true) {
		table.rows[selectedNr].className = "";
		this.className += "select";
		selectedNr = this.rowIndex;
		selected = true;
		let sessionId = Object.keys(sessionsJSON)[selectedNr - 1];
		showSessionDetails(sessionsJSON[sessionId].href, sessionId);
	}
	else if (this.id !== "th" && this.className !== "" && selected === true) {
		this.className = "";
		selected = false;
		selectedNr = 0;
		hideSessionDetails();
	}
}
// for (let i = 0; i < table.rows.length; i++) {
// 	table.rows[i].onclick = select;
// }

let objTable = document.getElementById("sitzungsObjekte");
let selectedObj = false;
let selectedObjNr;
function selectObj() {
	if (this.id !== "th" && this.className === "" && selectedObj === false) {
		this.className += "select";
		selectedObjNr = this.rowIndex;
		selectedObj = true;
	}
	else if (this.id !== "th" && this.className === "" && selectedObj === true) {
		objTable.rows[selectedObjNr].className = "";
		this.className += "select";
		selectedObjNr = this.rowIndex;
		selectedObj = true;
	}
	else if (this.id !== "th" && this.className !== "" && selectedObj === true) {
		this.className = "";
		selectedObj = false;
		selectedObjNr = 0;
	}
}

//Sitzungseigenschaft bearbeiten
document.getElementById("sitzung-bearbeiten").addEventListener("click", () => {
	document.getElementById("editForm").classList.remove("invisible");
	let row = document.getElementById("table").rows[selectedNr];
	let btn1 = document.getElementById("bestaetigen");
	let btn2 = document.getElementById("verwerfen");
	document.getElementById("editSitzung").value = document.getElementById("sitzungsName").innerHTML;
	document.getElementById("editDatum").value = document.getElementById("sitzungsDatum").innerHTML;
	document.getElementById("editOrt").value = document.getElementById("sitzungsOrt").innerHTML;
	document.getElementById("editObjekt").value = document.getElementById("sitzungsObjekte").innerHTML;
	btn1.addEventListener("click", () => {
		let nr = Object.keys(sessionsJSON)[selectedNr - 1];
		let sitzungText = document.getElementById("editSitzung").value;
		let datumText = document.getElementById("editDatum").value;
		let ortText = document.getElementById("editOrt").value;
		let objectText = document.getElementById("editObjekt").value;
		let request = new XMLHttpRequest();
		request.addEventListener("load", () => { console.log(""); });
		request.open("PUT", BASE_URI + `sessions/${nr}`);
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		request.send(`name=${sitzungText}&date=${datumText}&location=${ortText}&object=${objectText}`);

		hide();
		loadTable();
		document.getElementById("editForm").classList.add("invisible");
	});

	btn2.addEventListener("click", () => {
		document.getElementById("editSitzung").value = "";
		document.getElementById("editDatum").value = "";
		document.getElementById("editOrt").value = "";
		document.getElementById("editObjekt").value = "";
		hide();
	});
	function hide() {
		document.getElementById("editForm").classList.add("invisible");
	}
});

//Beobachtungsobjekt hinzufügen
document.getElementById("objekt-hinzufuegen").addEventListener("click", () => {
	document.getElementById("addObject").classList.remove("invisible");
	document.getElementById("addObj").addEventListener("click", () => {
		let sessionId = Object.keys(sessionsJSON)[selectedNr - 1];
		let name = document.getElementById("addObjName").value;
		let request = new XMLHttpRequest();
		request.addEventListener("load", () => { console.log(""); });
		request.open("POST", BASE_URI + "observingObjects");
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		request.send(`name=${name}&sessionId=${sessionId}`);
		// getObservingObjectNames(sessionId);
		hideSessionDetails();
		showSessionDetails(sessionsJSON[sessionId].href, sessionId);
		document.getElementById("addObject").classList.add("invisible");
	});
});

//Beobachtungsobjekt löschen
document.getElementById("objekt-loeschen").onclick = deleteObj;
function deleteObj() {
	let sessionId = Object.keys(sessionsJSON)[selectedNr - 1];
	let request = new XMLHttpRequest();
	request.addEventListener("load", () => {
		let observingObjects = request.response.observingObjects;
		let i = 0;
		let href;
		for (var key in observingObjects) {
			if (!observingObjects.hasOwnProperty(key)) { continue; }
			if (parseInt(observingObjects[key].sessionId) === parseInt(sessionId)) {
				href = observingObjects[key].href;
				let request3 = new XMLHttpRequest();
				request3.addEventListener("load", del(request3.response));
				request3.open("GET", href);
				request3.responseType = "json";
				request3.send();
			}
		}
		function del(response) {
			if (response.name === document.getElementById("sitzungsObjekte").rows[selectedObjNr].value) {
				let request2 = new XMLHttpRequest();
				request2.addEventListener("load", () => {
					hideSessionDetails();
					// showSessionDetails(sessionsJSON[sessionId].href, sessionId);
				});
				request2.open("DELETE", href);
				request2.responseType = "json";
				request2.send();
			}
		}
	});
	request.open("GET", `${BASE_URI}observingObjects`);
	request.responseType = "json";
	request.send();
}

//Sitzung hinzufügen
let sitzungAnlegenBtn = document.getElementById("sitzung-anlegen");
sitzungAnlegenBtn.addEventListener("click", () => {
	let sitzungText = document.getElementById("sitzung").value;
	let datumText = document.getElementById("datum").value;
	let ortText = document.getElementById("ort").value;
	let objectText = document.getElementById("objekt").value;

	console.log(sitzungText);
	console.log(datumText);
	console.log(ortText);

	//Request senden
	let request = new XMLHttpRequest();
	request.open("POST", BASE_URI + "sessions");
	request.addEventListener("load", () => loadTable());
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.responseType = "json";
	request.send(`name=${sitzungText}&date=${datumText}&location=${ortText}&object=${objectText}`);

	//Felder leeren
	document.getElementById("sitzung").value = "";
	document.getElementById("datum").value = "";
	document.getElementById("ort").value = "";
	document.getElementById("objekt").value = "";
});

//Sitzung anzeigen
function showSessionDetails(sessionLink, sessionId) {
	let request = new XMLHttpRequest();
	request.addEventListener("load", () => {
		let response = request.response;
		getObservingObjectNames(sessionId);
		document.getElementById("sitzungsName").innerHTML = response.session.name;
		document.getElementById("sitzungsDatum").innerHTML = response.session.date;
		document.getElementById("sitzungsOrt").innerHTML = response.session.location;
		document.getElementById("sitzungsanzeige").classList.remove("invisible");
		document.getElementById("buttons").classList.remove("invisible");
	});
	request.open("GET", sessionLink);
	request.responseType = "json";
	request.send();
}

//Sitzung verstecken
function hideSessionDetails() {
	document.getElementById("sitzungsanzeige").classList.add("invisible");
	document.getElementById("sitzungsName").innerHTML = "";
	document.getElementById("sitzungsDatum").innerHTML = "";
	document.getElementById("sitzungsOrt").innerHTML = "";
	document.getElementById("sitzungsObjekte").innerHTML = "";
	document.getElementById("sitzungsanzeige").classList.add("invisible");
	document.getElementById("buttons").classList.add("invisible");
	document.getElementById("editForm").classList.add("invisible");
}

//ObservingObject requesten und alle mit gewisser SessionId requesten
function getObservingObjectNames(sessionId) {
	//Vorher eventuell gesetzes Element leeren
	document.getElementById("sitzungsObjekte").innerHTML = "";
	//Liste anfragen
	let request = new XMLHttpRequest();
	request.addEventListener("load", () => {
		//Einzelne Objekte anfragen
		let observingObjects = request.response.observingObjects;
		// if(document.getElementById("sitzungsObjekte").rows[0])
		if (document.getElementById("sitzungsObjekte").innerHTML === "") {
			let thead = document.createElement("thead");
			let row = document.createElement("tr");
			let th = document.createElement("th");
			th.innerHTML = "Beobachtungsobjekte";
			row.appendChild(th);
			thead.appendChild(row);
			document.getElementById("sitzungsObjekte").appendChild(thead);
		}
		for (var key in observingObjects) {
			if (!observingObjects.hasOwnProperty(key)) { continue; }

			if (parseInt(observingObjects[key].sessionId) === parseInt(sessionId)) {
				//Einzelne Objekte anfragen
				let href = observingObjects[key].href;
				let request2 = new XMLHttpRequest();
				request2.addEventListener("load", () => {
					//Objekte html-Seite hinzufügen
					let observingObject = request2.response.observingObject;
					let row = document.createElement("tr");
					let text = document.createElement("td");
					text.innerHTML = observingObject.name;
					row.appendChild(text);
					row.addEventListener("click", selectObj);
					document.getElementById("sitzungsObjekte").appendChild(row);
					// document.getElementById("sitzungsObjekte").innerHTML += observingObject.name + "<br/>";
				});
				request2.open("GET", href);
				request2.responseType = "json";
				request2.send();
			}
		}
	});
	request.open("GET", `${BASE_URI}observingObjects`);
	request.responseType = "json";
	request.send();
}

//Sitzung löschen
document.getElementById("sitzung-loeschen").onclick = deleteSession;
function deleteSession() {
	let sessionId = Object.keys(sessionsJSON)[selectedNr - 1];

	//Request senden
	let request = new XMLHttpRequest();
	request.open("DELETE", BASE_URI + `sessions/${sessionId}`);
	request.addEventListener("load", () => loadTable());
	request.responseType = "json";
	request.send();
}
