const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const logger = require("heroku-logger");
const cors = require("cors");
const compression = require("compression");
const forceSsl = require('force-ssl-heroku');

const parlamentares = require("./routes/api/parlamentares");
const buscaParlamentar = require("./routes/api/busca-parlamentar");
const proposicoes = require("./routes/api/proposicao");
const assiduidade = require("./routes/api/assiduidade");

const app = express();
app.use(forceSsl);

app.use(compression());
var db = require("./models/index");

const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:3000'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["authorization", ]
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Testa conexão com o BD
db.sequelize
  .authenticate()
  .then(() => {
    logger.info("Conexão com BD estabelecida com sucesso.");
  })
  .catch(err => {
    logger.error("Não foi possível conectar com o BD: ", err);
  });

// Usar as rotas
app.use("/api/parlamentares", parlamentares);
app.use("/api/busca-parlamentar", buscaParlamentar);
app.use("/api/proposicoes", proposicoes);
app.use("/api/assiduidade", assiduidade);

// Set static folder
app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => logger.info(`Servidor rodando na porta ${port}`));
