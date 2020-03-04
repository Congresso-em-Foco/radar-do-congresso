const express = require("express");
const router = express.Router();
const { validationResult } = require('express-validator');
const { calculaAssiduidade } = require('../../utils/functions');

const models = require("../../models/index");
const casaValidator = require("../../utils/middlewares/casa.validator");

const Assiduidade = models.assiduidade;
const Parlamentar = models.parlamentar;
const Partido = models.partido;

const BAD_REQUEST = 400;
const SUCCESS = 200;

const attAssiduidade = [
  "ano",
  ["dias_com_sessoes_deliberativas", "totalSessoesDeliberativas"], 
  ["dias_presentes", "totalPresenca"], 
  ["dias_ausencias_justificadas", "totalAusenciasJustificadas"],
  ["dias_ausencias_nao_justificadas", "totalAusenciasNaoJustificadas"]
];

const attParlamentar = [
  ["id_parlamentar_voz", "idParlamentarVoz"],
  ["id_parlamentar", "idParlamentar"],
  ["nome_eleitoral", "nomeEleitoral"],
  "uf",
  "genero",
  ["em_exercicio", "emExercicio"],
  "casa"
];

const attPartido = [
  ["id_partido", "idPartido"], 
  "sigla", 
  "tipo"];

/**
 * Lista assiduidade dos parlamentares
 * @name get/api/assiduidade
 * @apiparam casa Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
 * @function
 * @memberof module:routes/assiduidade 
 */
router.get("/", casaValidator.validate, (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const casa = req.param("casa") || "camara";
  const ano = req.param("ano") || 2020;

  Assiduidade.findAll({
    attributes: attAssiduidade,
    include: [
      {
        model: Parlamentar,
        attributes: attParlamentar,
        as: "assiduidadeParlamentar",
        required: true,
        include: [
          {
          model: Partido,
          as: "parlamentarPartido",
          attributes: attPartido,
          }
        ]
      }
    ],
    where: {
      casa: casa,
      ano: ano
    },
    order: [
      ["ano", "ASC"],
      ["dias_presentes", "DESC"]
    ],
    
  })
    .then(assiduidade => {
      assiduidadeComPercentual = calculaAssiduidade(assiduidade);
      return res.status(SUCCESS).json(assiduidadeComPercentual);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

module.exports = router;