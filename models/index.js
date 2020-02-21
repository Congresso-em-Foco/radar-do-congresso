const Sequelize = require("sequelize");
const logger = require("heroku-logger");

// Models
const ParlamentarModel = "./postgres/parlamentar.js";
const PartidoModel = "./postgres/partidos.js";
const ProposicaoModel = "./postgres/proposicao.js";
const ParlamentarProposicaoModel = "./postgres/parlamentar-proposicao.js";

if (!global.hasOwnProperty("models")) {
  const db = require("../config/keys").postgresURI;

  // Connect to Postgres
  const sequelize = new Sequelize(db, {
    host: "localhost",
    dialect: "postgres",
    operatorsAliases: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production'
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  global.models = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    parlamentar: sequelize.import(ParlamentarModel),
    partido: sequelize.import(PartidoModel),
    proposicao: sequelize.import(ProposicaoModel),
    parlamentarProposicao: sequelize.import(ParlamentarProposicaoModel) 
    // add your other models here
  };

  Object.keys(global.models).forEach(modelName => {
    console.log(modelName);
    if (global.models[modelName].associate) {
      global.models[modelName].associate(global.models);
    }
  });
  
  sequelize.sync({ force: false }).then(() => {
    console.log("BD sincronizado");
  });
  // Retorna campos do tipo decimal como float e não como string
  Sequelize.postgres.DECIMAL.parse = function (value) { return parseFloat(value); };
}
module.exports = global.models;
