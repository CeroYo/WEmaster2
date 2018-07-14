(function () {
	let request = new XMLHttpRequest();
	request.addEventListener("load", () => { createList(request.response); });
	request.open("GET", "http://localhost:8080/sessions");
	request.responseType = "json";
	request.send();

	function createList(response) {
		for (var key in response.sessions) {
			if (!response.sessions.hasOwnProperty(key)) { continue; }
			if ((document.body.clientHeight + 100) >= (document.getElementById("table").clientHeight * 0.9)) {
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
					row.onclick = select;
					document.getElementById("table").appendChild(row);
				});
				request2.open("GET", response.sessions[key].href);
				request2.responseType = "json";
				request2.send();
			}
			else {
				//Neue Seite mit Rest erzeugen
			}
		}
	}
})();

// Selectioncolor; Funktioniert nicht bei Feldern mit vorher definierten Feldern
let table = document.getElementById("table");
let selected = false;
let selectedNr;
function select() {
	if (this.id !== "th" && this.className === "" && selected === false) {
		this.className += "select";
		selectedNr = this.rowIndex;
		selected = true;
	}
	else if (this.id !== "th" && this.className === "" && selected === true) {
		table.rows[selectedNr].className = "";
		this.className += "select";
		selectedNr = this.rowIndex;
		selected = true;
	}
	else if (this.id !== "th" && this.className !== "" && selected === true) {
		this.className = "";
		selected = false;
		selectedNr = 0;
	}
}
for (let i = 0; i < table.rows.length; i++) {
	table.rows[i].onclick = select;
}

//Sitzung löschen
// document.getElementById("sitzung-loeschen").addEventListener("click", () => {
// 	//
// });

//Sitzungseigenschaft bearbeiten
document.getElementById("sitzung-bearbeiten").addEventListener("click", () => {
	let row = document.getElementById("table").rows[selectedNr];
	let btn1 = document.createElement("button");
	let btn2 = document.createElement("button");
	//Größe lässt sich nicht verändern?
	btn1.style.height = row.clientHeight;
	row.appendChild(btn1);
	row.appendChild(btn2);
	let titleBuffer = row.cells[0].innerHTML;
	let dateBuffer = row.cells[1].innerHTML;
	let ortBuffer = row.cells[2].innerHTML;
	btn1.addEventListener("click", () => {
		//weiß nicht wie data aussehen muss / was put erwartet
		let data = {
			name: row.cells[0].innerHTML,
			date: row.cells[1].innerHTML,
			location: row.cells[2].innerHTML
		};
		let request = new XMLHttpRequest();
		request.addEventListener("load", () => { console.log(""); });
		request.open("PUT", `http://localhost:8080/sessions/${selectedNr}`);
		request.setRequestHeader("Content-Type", "application/json");
		request.send(data);
		row.contentEditable = "false";
		del();
	});
	btn2.addEventListener("click", () => {
		row.cells[0].innerHTML = titleBuffer;
		row.cells[1].innerHTML = dateBuffer;
		row.cells[2].innerHTML = ortBuffer;
		row.contentEditable = "false";
		del();
	});
	function del() {
		row.removeChild(btn1);
		row.removeChild(btn2);
	}
	row.contentEditable = "true";
});

////Reihe hinzufügen Actionevent; HTML-Seite resetted nach 0,1sec wieder
// let anlegenBtn = document.getElementById("sitzung-anlegen");
// anlegenBtn.onclick = function () {
// 	let row = document.createElement("tr");
// 	let cell = document.createElement("td");
// 	cell.textContent = document.getElementById("sitzung").innerHTML;
// 	row.appendChild(cell);
// 	cell = document.createElement("td");
// 	cell.textContent = document.getElementById("datum").innerHTML;
// 	row.appendChild(cell);
// 	cell = document.createElement("td");
// 	cell.textContent = document.getElementById("ort").innerHTML;
// 	row.appendChild(cell);
// 	document.getElementById("table").appendChild(row);
// };

// Anderer Versuch für Selectioncolor
// let table = document.getElementById("table");
// let selected = false;
// let selectedNr;

// let select = function () {
// 	if (this.style.backgroundColor !== "yellow" && selected === false) {
// 		this.style.backgroundColor = "yellow";
// 		selectedNr = this.rowIndex;
// 		selected = true;
// 	}
// 	else if (this.style.backgroundColor !== "yellow" && selected === true) {
// 		table.rows[selectedNr].style.backgroundColor = "";
// 		this.style.backgroundColor = "yellow";
// 		selectedNr = this.rowIndex;
// 		selected = true;
// 	}
// 	else {
// 		this.style.backgroundColor = "";
// 		selected = false;
// 	}
// };
// for (let i = 0; i < table.rows.length; i++) {
// 	table.rows[i].onclick = select;
// }
