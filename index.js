const express = require("express");

const winston = require("winston");

// "silly" | "input" | "verbose" | "prompt" | "debug" | "info" | "data" | "help" | "warn" | "error";
const logger = winston.createLogger({
  level: "warn",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "logs.txt"
    })
  ]
});

const app = express();

app.use(express.json());

app.use(express.static("./public"));

app.get("/", (req, res, next) => {
  res.status(201).send("Hola mundo!");
});

app.post("/", (req, res) => {
  res.send("Hola desde POST");
});

app.put("/", (req, res) => {
  res.send("Hola desde PUT");
});

app.delete("/", (req, res) => {
  res.send(`Hola desde ${req.method}`);
});

app.get("/holamundo", (req, res) => {
    res.send("Wenos dias, tardes ya ayayay que barbaro");
});

app.post('/post', function (req, res) {
    console.log('Got body:', req.body);
    res.send(req.body);
});

const sayHello = (req, res, next) => {
  logger.info("sayHello");
  next();
};

const decirHola = (req, res, next) => {
  logger.debug("decirHola");
  next();
}

app.get("/hola", decirHola, sayHello, (req, res) => {
  logger.warn("good bye");
  res.send("Done");
});

app.get("/hola/:nombre", (req, res, next) => {
  const nombre = req.params.nombre;
  res.send(`Hola ${nombre}`);
});

app.post("/alumno", (req, res, next) => {
  logger.debug(req.body);
  logger.debug(req.query);
  const age = parseInt(req.query.age);
  logger.debug(age);
  if (Number.isNaN(age)) {
    throw new Error('Age invalid value');
  }
  // Almacenar DB
  const data = req.body;
  data.age = age;
  data.id = Math.random() * 10;
  res.json(data);
});

app.get("/ejemplo", (req, res, next) => {
  res.redirect("/hola");
});

app.use((error, req, res, next) => {
  console.log("Ocurrió un error");
  next(error);
});

app.use((error, req, res, next) => {
  res.status(400).json({ error });
});

app.listen(3000, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("El servidor se está ejecutando en el puerto 3000");
});
