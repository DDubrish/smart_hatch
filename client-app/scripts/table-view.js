let arrHatchState = [];
let selectedOrgId = "0";

//Запрос из клиента на получение списка организаций, которые зарегистрированы в БД
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

//Запрос из клиента на обновление данных по люкам
async function updateHatchStateAsync() {
  const queryString = selectedOrgId === "0" ? "" : `?orgId=${selectedOrgId}`;
  const response = await fetch(`${API_URL}/hatches${queryString}`, {
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
      let row = document.createElement("tr");
      let cellId = document.createElement("td");
      cellId.innerHTML = hatch.id;

      let cellState = document.createElement("td");
      let img = document.createElement("img");
      img.setAttribute("src", hatch.state == "1" ? GREEN_IMG : RED_IMG);
      cellState.appendChild(img);

      let cellAddress = document.createElement("td");
      cellAddress.innerHTML = hatch.landmark;

      row.appendChild(cellId);
      row.appendChild(cellState);
      row.appendChild(cellAddress);
      row.setAttribute("class", "hatchRow");
      // row.setAttribute("id", "TR");
      hatchTable.appendChild(row);
    });

    const hasPreviousData = arrHatchState.length > 0;
    const updatedHatches = inspectHatches(hatches);
    if (!hasPreviousData) {
      addMarker(hatches);
    } else if (showAlert(updatedHatches)) {
      //если это не первый запуск, а обновление, то показываем alert
      //showAlert(updatedHatches);
      vectorSource.clear();
      addMarker(hatches);
    }

    console.log(arrHatchState);
  }
}

//Проверка данных по люкам
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

//если данные обновились то показывать всплывающее окно
function showAlert(updatedHatches) {
  if (!updatedHatches || updatedHatches.length == 0) {
    //если битый ответ от сервера или пусто в таблице бд, или никакое состояние новое не пришло
    return false;
  }

  let alertMsg = "";
  updatedHatches.forEach((hatch) => {
    alertMsg += `Люк ${hatch.id} изменил состояние на ${
      hatch.state === 1 ? "Исправен" : "Сдвинут"
    }\n`;
  });

  alert(alertMsg);

  return true;
}

async function addRowHandlers() {
  // console.log("$$$$");
  // var table = document.getElementById("tableStateHatch");
  // var rows = table.getElementsByTagName("tr");
  // for (i = 1; i < rows.length; i++) {
  //   row = table.rows[i];
  //   console.log(row);
  //   var createClickHandler = function (row) {
  //     return function () {
  //       console.log("0000000");
  //     };
  //   };
  //   row.onclick = createClickHandler(row);
  // }
  var rows = document.getElementById("tableStateHatch").rows;
  console.log(rows);
  for (i = 0; i < rows.length; i++) {
    console.log(rows.length);
    rows[i].onclick = (function () {
      return function () {
        var id = this.cells[0].innerHTML;
        alert("id:" + id);
      };
    })(rows[i]);
  }
}

async function initAsync() {
  await getOrgsAsync();
  await updateHatchStateAsync();
  // document.onload = addRowHandlers();
}

document.addEventListener("DOMContentLoaded", initAsync, false);
// document.addEventListener("onload", addRowHandlers, false);

setInterval(updateHatchStateAsync, REFRESH_TIMEOUT_MS);

document.getElementById("organization").addEventListener("change", function () {
  var select = document.getElementById("organization");
  var idOrg = select.options[select.selectedIndex].value;
  selectedOrgId = idOrg;
  updateHatchStateAsync();
});

// document.onload = addRowHandlers();

// document.addEventListener("DOMContentLoaded", addRowHandlers);
