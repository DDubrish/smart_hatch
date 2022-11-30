const API_URL = "http://127.0.0.1:5501";
const GREEN_IMG = "images/green.png";
const RED_IMG = "images/red.png";
const REFRESH_TIMEOUT_MS = 20000;

let arrHatchState = [];
let selectedOrgId = null;

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
      // console.log(hatch.id, hatch.state);

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

    const hasPreviousData = arrHatchState.length > 0;
    const updatedHatches = inspectHatches(hatches);
    if (hasPreviousData) {
      //если это не первый запуск, а обновление, то показываем alert
      showAlert(updatedHatches);
    }

    console.log(arrHatchState);
  }
}

function inspectHatches(hatches) {
  let updatedHatches = [];

  hatches.forEach((hatch) => {
    let existingHatch = arrHatchState.find((item) => item.id == hatch.id);
    if (!existingHatch) {
      //если такого люка еще нет, то добавляем
      arrHatchState.push({ id: hatch.id, state: hatch.state });
      updatedHatches.push({ id: hatch.id, state: hatch.state });
    } else {
      if (existingHatch.state === hatch.state) {
      } else {
        existingHatch.state = hatch.state;
        updatedHatches.push({ id: hatch.id, state: hatch.state });
      }
    }
  });

  // console.log(updatedHatches);
  return updatedHatches;
}

function showAlert(updatedHatches) {
  if (!updatedHatches || updatedHatches.length == 0) {
    //если битый ответ от сервера или пусто в таблице бд, или никакое состояние новое не пришло
    return;
  }

  let alertMsg = "";
  updatedHatches.forEach((hatch) => {
    alertMsg += `Люк ${hatch.id} изменил состояние на ${
      hatch.state === 1 ? "Исправен" : "Сдвинут"
    }\n`;
  });

  alert(alertMsg);
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
