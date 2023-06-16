const express = require("express"); //получаем модуль
const app = express(); //создаем приложение

const cors = require("cors");
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

const sqlite3 = require("sqlite3");
const { Route } = require("express");

//Соединение с БД
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

//Эта функция срабатывает когда запущен сервер. В браузере надо открыть 127.0.0.1:5501
//Устанавливаем обработчик для маршрута "/". Это главная страница или корневой маршрут. Get функция, кот.обрабатывает запрос по этому маршруту
app.get("/org", (req, res) => {
  const sql = "SELECT id, name FROM org";
  console.log("Requesting Orgs");
  db.run(sql);

  db.all(sql, [], (err, rows) => {
    const str = []; //создание пустого массива в js
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      str.push({ id: row.id, name: row.name });
    });

    console.log(`Request finished`);
    res.send(str);
  });
});

//данные из формы отправляются с помощью метода post(адрес на который идет отправка, созданный парсер, обработчик)
app.post("/org", urlencodedParser, (request, response) => {
  if (!request.body) return response.sendStatus(400);
  console.log(request.body);
  const orgId = request.body.id;
  const orgName = request.body.name;

  const sql = `INSERT INTO org (id, name) VALUES (${orgId}, '${orgName}');`;
  console.log(sql);
  db.run(sql);

  getOrgs();

  response.send(`Added org ${request.body.name} - ${request.body.id}`);
});

//данные из формы отправляются с помощью метода post(адрес на который идет отправка, созданный парсер, обработчик)
app.post("/hatch", urlencodedParser, (request, response) => {
  if (!request.body) return response.sendStatus(400);
  console.log(request.body);
  const hatchId = request.body.id;
  const orgId = request.body.orgId;
  const coordX = request.body.coordX;
  const coordY = request.body.coordY;
  const landmark = request.body.landmark;
  const state = request.body.state;
  const dateTo = request.body.dateTo;
  const dateLastWork = request.body.dateLastWork;

  const sql = `INSERT INTO luk(id, org, koord_x, koord_y, landmark,  date_to, condition, date_last_work) 
    VALUES(${hatchId}, '${orgId}', '${coordX}', '${coordY}','${landmark}','${dateTo}','${state}', '${dateLastWork}');`;
  console.log(sql);
  db.run(sql);

  response.send(`Added ${request.body.name} - ${request.body.id}`);
});

app.get("/hatches", (req, res) => {
  console.log("333 = " + req.query.orgId);
  const searchQuery = req.query.orgId ? `WHERE org =${req.query.orgId}` : "";
  console.log("id = " + searchQuery);
  // const sql = `SELECT id, condition FROM luk`;
  const sql = `SELECT id, condition, koord_x, koord_y, landmark FROM luk ${searchQuery}`;
  console.log(sql);
  console.log("Requesting state hatch");
  db.run(sql);

  db.all(sql, [], (err, rows) => {
    let str = [];
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      str.push({
        id: row.id,
        state: row.condition,
        coord_x: row.koord_x,
        coord_y: row.koord_y,
        landmark: row.landmark,
      });
    });

    console.log(`Request finished`);
    res.send(str);
  });
});

app.get("/hatchesCurrentOrg", (req, res) => {
  const sql = `SELECT id, condition FROM luk`;
  console.log("Requesting state hatch");
  db.run(sql);

  db.all(sql, [], (err, rows) => {
    let str = [];
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      str.push({ id: row.id, state: row.condition });
    });

    console.log(`Request finished`);
    res.send(str);
  });
});

// app.get("/", (req, res) => {
//   res.send("Hello! I am Hatch Keeper");
// });

app.listen(5501, () => {
  console.log("server started");
});
