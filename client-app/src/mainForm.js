// Добавление пользователя
//Создаем асинхронную функцию
async function addHatch(hatch) {
  //асинхронная операция, приостанавливает выполнение функции,пока не вернется результат. fetch(параметры ресурса, куда функция обращается, доп.настройки запроса) -
  //возвращает объект Promise,который получает ответ после завершения запроса к сетевому ресурсу
  const response = await fetch("http://127.0.0.1:5501/hatch", {
    //метод запроса
    method: "POST",
    //набор заголовков ответа
    headers: {
      //клиент принимает данные в формате json
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    //содержимое ответа, данные которые добавляются в запрос
    body: new URLSearchParams({
      id: hatch.id,
      orgId: hatch.orgId,
      coordX: hatch.coordX,
      coordY: hatch.coordY,
      state: hatch.state,
      dateTo: hatch.dateTo,
      dateLastWork: hatch.dateLastWork,
    }),
  });
}

async function getOrg() {
  const response = await fetch("http://127.0.0.1:5501/org", {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (response.ok === true) {
    const orgs = await response.json();
    let orgSelect = document.querySelector("[id='organization']");
    orgs.forEach((org) => {
      let option = document.createElement("option");
      option.value = org.id;
      option.textContent = org.name;

      orgSelect.appendChild(option);
    });
  }
}

// отправка формы
// Свойство навигации по формам
document.forms["hatchForm"].addEventListener("submit", (event) => {
  //отмена стандарного действия браузера
  event.preventDefault();
  //Элементы формы
  let hatch = {};
  const form = document.forms["hatchForm"];
  hatch.id = form.elements["id"].value;

  var sel = document.getElementById("organization");
  hatch.orgId = sel.options[sel.selectedIndex].value;

  hatch.coordX = form.elements["coordX"].value;
  hatch.coordY = form.elements["coordY"].value;
  hatch.state = form.elements["state"].value;
  hatch.dateTo = form.elements["dateTo"].value;
  hatch.dateLastWork = form.elements["dateLastWork"].value;

  addHatch(hatch);
  event.target.reset();
});

document.addEventListener("DOMContentLoaded", getOrg, false);

document.getElementById("mapBtn").addEventListener(
  "click",
  () => {
    let mapDiv = document.getElementById("OSMap");
    if (mapDiv) {
      mapDiv.hidden = !mapDiv.hidden;
    }
  },
  false
);
