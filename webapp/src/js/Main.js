// Selectioncolor; Funktioniert nicht bei Feldern mit vorher definierten Feldern
let table = document.getElementById("table");
let selected = false;
let selectedNr;
let select = function () {
	if (this.className === "" && selected === false) {
		this.className += "select";
		selectedNr = this.rowIndex;
		selected = true;
	}
	else if (this.className === "" && selected === true) {
		table.rows[selectedNr].className = "";
		this.className += "select";
		selectedNr = this.rowIndex;
		selected = true;
	}
	else {
		this.className = "";
		selected = false;
	}
};
for (let i = 0; i < table.rows.length; i++) {
	table.rows[i].onclick = select;
}

//Reihe hinzufügen Actionevent; HTML-Seite resetted nach 0,1sec wieder
let anlegenBtn = document.getElementById("sitzung-anlegen");
anlegenBtn.onclick = function () {
	let row = document.createElement("tr");
	let cell = document.createElement("td");
	cell.textContent = document.getElementById("sitzung").innerHTML;
	row.appendChild(cell);
	cell = document.createElement("td");
	cell.textContent = document.getElementById("datum").innerHTML;
	row.appendChild(cell);
	cell = document.createElement("td");
	cell.textContent = document.getElementById("ort").innerHTML;
	row.appendChild(cell);
	document.getElementById("table").appendChild(row);
};

document.getElementById("sitzung-bearbeiten").addEventListener("click", e => {
	document.getElementById("table").contentEditable = "true";
});

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
