const API_URL = "http://127.0.0.1:5501";
const GREEN_IMG = "img/green.png";
const RED_IMG = "img/red.png";
const REFRESH_TIMEOUT_MS = 20000;

async function getOrgsAsync() {
  const response = await fetch(`${API_URL}/org`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (response.ok === true) {
    const orgs = await response.json();
    const orgSelect = document.querySelector("[id='organization']");
    orgs.forEach((org) => {
      let option = document.createElement("option");
      option.value = org.id;
      option.textContent = org.name;

      orgSelect.appendChild(option);
    });
  }
}

async function updateHatchStateAsync() {
  const response = await fetch(`${API_URL}/hatches`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (response.ok === true) {
    const hatches = await response.json();
    const hatchTable = document.querySelector("[id='tableStateHatch']");

    const existingRows = document.getElementsByClassName("hatchRow");
    while (existingRows.length > 0) {
      existingRows[0].parentNode.removeChild(existingRows[0]);
    }

    hatches.forEach((hatch) => {
      console.log(hatch.id, hatch.state);

      let row = document.createElement("tr");
      let cellId = document.createElement("td");
      cellId.innerHTML = hatch.id;

      let cellState = document.createElement("td");
      let img = document.createElement("img");
      img.setAttribute("src", hatch.state == "1" ? GREEN_IMG : RED_IMG);
      cellState.appendChild(img);

      row.appendChild(cellId);
      row.appendChild(cellState);
      row.setAttribute("class", "hatchRow");
      hatchTable.appendChild(row);
    });
  }
}

async function initAsync() {
  await getOrgsAsync();
  await updateHatchStateAsync();
}

document.addEventListener("DOMContentLoaded", initAsync, false);

setInterval(updateHatchStateAsync, REFRESH_TIMEOUT_MS);

document.getElementById("organization").addEventListener("change", function () {
  var select = document.getElementById("organization");
  var idOrg = select.options[select.selectedIndex].value;
  console.log(idOrg);
});
