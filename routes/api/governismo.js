const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");

const models = require("../../models/index");
const casaValidator = require("../../utils/middlewares/casa.validator");

const Votacao = models.votacao;
const Voto = models.voto;
const Parlamentar = models.parlamentar;
const Partido = models.partido;

const BAD_REQUEST = 400;
const SUCCESS = 200;

const attVotacao = [
  ["data_hora","data"],
  "orientacao"
];
const attVoto = [
  ["id_parlamentar_voz","id"],
  "voto"
];
const attParlamentar = [
  ["id_parlamentar_voz","id"],
  ["nome_eleitoral","nome"],
  "uf"
];
const attPartido = [
  "sigla"
];

/**
 * Lista governismo
 * @name get/api/governismo/
 * @apiparam casa Casa de origem das votaçoes Pode ser "camara" (default) ou "senado".
 * @function
 * @memberof module:routes/governismo
 */
router.get("/", casaValidator.validate, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const casa = req.param("casa") || "camara";

  Votacao.findAll({
    attributes: attVotacao,
    where: { casa: casa },
    include: [
      {
        model: Voto,
        attributes: attVoto,
        as: "votacoesVoto",
        required: true
      }
    ]
  })
  .then(governismo => {
    return res.status(SUCCESS).json(governismo);
  })
  .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

router.get("/:id", (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Voto.findAll({
    attributes: attVoto,
    where: { id_parlamentar_voz: req.params.id },
    include: [
      {
        model: Votacao,
        attributes: attVotacao,
        as: "votoVotacao",
        required: true,
      }
    ]
  })
  .then(votos => res.json(votos))
  .catch(err => res.status(BAD_REQUEST).json({ err }));
});


module.exports = router;
