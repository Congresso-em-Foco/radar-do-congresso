const express = require("express");

const router = express.Router();

const models = require("../../models/index");

const Parlamentar = models.parlamentar;
const Partido = models.partido;

const BAD_REQUEST = 400;
const SUCCESS = 200;

const attParlamentar = [
  ["id_parlamentar_voz", "idParlamentarVoz"],
  ["id_parlamentar", "idParlamentar"],
  ["nome_eleitoral", "nomeEleitoral"],
  "uf",
  ["em_exercicio", "emExercicio"],
  "casa"
];

const attPartido = [["id_partido", "idPartido"], "sigla"];

/**
 * Recupera informações da lista de parlamentares (atualmente em exercício) (com informações do parlamentar inclusas)
 * 
 * @name get/api/busca-parlamentar
 * @function
 * @memberof module:routes/busca-parlamentar
 */
router.get("/", (req, res) => {
  Parlamentar.findAll({
    attributes: attParlamentar,
    include: [
      {
        model: Partido,
        attributes: attPartido,
        as: "parlamentarPartido",
        required: false
      }
    ],
    where: {
      em_exercicio: true
    }
  })
    .then(parlamentares => {
      const result = parlamentares.map(parlamentar => {
        let data = parlamentar.toJSON();
        data['nomeProcessado'] = data['nomeEleitoral'].normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        return data;
      });
      res.status(SUCCESS).json(result);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

module.exports = router;