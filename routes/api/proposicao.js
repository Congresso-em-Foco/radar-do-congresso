const express = require("express");
const router = express.Router();
const { validationResult } = require('express-validator');

const models = require("../../models/index");
const casaValidator = require("../../utils/middlewares/casa.validator");

const Proposicao = models.proposicao;
const Votacao = models.votacao;

const BAD_REQUEST = 400;
const SUCCESS = 200;

const attVotacao = [
  ["id_votacao", "idVotacao"], 
  ["obj_votacao", "objetoVotacao"], 
  ["data_hora", "data"],
  ["votacao_secreta", "votacaoSecreta"]
];

/**
 * Lista proposições com votações
 * @name get/api/proposicoes/votacoes
 * @apiparam casa Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
 * @function
 * @memberof module:routes/proposicoes 
 */
router.get("/votacoes", casaValidator.validate, (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const casa = req.param("casa") || "camara"

  Proposicao.findAll({
    attributes: ["nome", ["id_proposicao", "idProposicao"], "casa"],
    include: [
      {
        model: Votacao,
        attributes: attVotacao,
        as: "proposicaoVotacoes",
        required: true
      }
    ],
    order: [
      ["proposicaoVotacoes", "id_votacao", "ASC"],
      ["id_proposicao", "ASC"]
    ],
    where: {
      casa: casa
    }
  })
    .then(proposicoes => {
      return res.status(SUCCESS).json(proposicoes);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

module.exports = router;