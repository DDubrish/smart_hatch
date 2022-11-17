const express = require("express"); //получаем модуль
const app = express(); //создаем приложение

const cors = require("cors");
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

const sqlite3 = require("sqlite3");
/*
let fun = sum;
console.log(fun(3, 4));

fun = multy;
console.log(fun(3, 4));

function sum(x, y) { return x+y;}
function multy(x, y) { return x*y;}*/

//connecting database
function getDb() {
  let db = new sqlite3.Database("luk.db", (err) => {
    if (err) {
      console.log("Error Occured - " + err.message);
      return null;
    } else {
      console.log("Database Connected");
    }
  });
  return db;
}

const db = getDb();

//Функция выводит названия всех организаций из таблицы org
function getOrgs() {
  let sql = `SELECT * FROM org`;
  let result = "";
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row.name);
      result = result + " " + row.name;
    });
  });
}

getOrgs();

//создание парсера для данных
const urlencodedParser = express.urlencoded({ extended: false });

//данные из формы отправляются с помощью метода post(адрес на который идет отправка, созданный парсер, обработчик)
app.post("/org", urlencodedParser, (request, response) => {
  if (!request.body) return response.sendStatus(400);
  console.log(request.body);
  const orgId = request.body.id;
  const orgName = request.body.name;
  const coordX = request.body.coordX;
  const coordY = request.body.coordY;
  const state = request.body.state;
  const dateTo = request.body.dateTo;
  const dateLastWork = request.body.dateLastWork;
  console.log("qqqqqqq = " + typeof state);

  const sql =
    `INSERT INTO org (id, name) VALUES (` + orgId + `,'` + orgName + `');`;
  console.log(sql);
  db.run(sql);

  const sql2 =
    `INSERT INTO luk(id,org, koord_x, koord_y, date_to, condition, date_last_work) VALUES(` +
    orgId +
    `,'` +
    orgName +
    `','` +
    coordX +
    `','` +
    coordY +
    `','` +
    dateTo +
    `',` +
    state +
    `,'` +
    dateLastWork +
    `');`;
  console.log(sql2);
  db.run(sql2);

  getOrgs();

  response.send(`Added ${request.body.name} - ${request.body.id}`);
  //response.send(`${request.body.name} - ${request.body.id}`);
});

//Эта функция срабатывает когда запущен сервер. В браузере надо открыть 127.0.0.1:5501
//Устанавливаем обработчик для маршрута "/". Это главная страница или корневой маршрут. Get функция, кот.обрабатывает запрос по этому маршруту
app.get("/", (req, res) => {
  res.send("Hello! I am Hatch Keeper");
});

app.listen(5501, () => {
  console.log("server started");
});
