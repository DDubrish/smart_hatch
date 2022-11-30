const API_URL = "http://127.0.0.1:5501";

// Добавление пользователя
//Создаем асинхронную функцию
async function addOrg(org) {
  //асинхронная операция, приостанавливает выполнение функции,пока не вернется результат. fetch(параметры ресурса, куда функция обращается, доп.настройки запроса) -
  //возвращает объект Promise,который получает ответ после завершения запроса к сетевому ресурсу
  const response = await fetch(`${API_URL}/org`, {
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
      id: org.id,
      name: org.name,
    }),
  });
}

// отправка формы
// Свойство навигации по формам
document.forms["orgForm"].addEventListener("submit", (event) => {
  //отмена стандарного действия браузера
  event.preventDefault();
  //Элементы формы
  let org = {};
  const form = document.forms["orgForm"];
  org.id = form.elements["id"].value;
  org.name = form.elements["organization"].value;

  addOrg(org);
  alert("Организация добавлена!");

  event.target.reset();
});
