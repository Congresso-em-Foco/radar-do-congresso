const express = require("express");
const router = express.Router();
const { validationResult } = require('express-validator');
const { calculaAssiduidade, getFoto } = require('../../utils/functions');

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

/**
 * Lista assiduidade dos parlamentares simplificado para o governismo
 * @name get/api/assiduidade/simplificado
 * @apiparam casa Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
 * @function
 * @memberof module:routes/assiduidade 
 */
router.get("/simplificado", casaValidator.validate, (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const casa = req.param("casa") || "camara";

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
      casa: casa
    }
  })
  .then(assiduidade => {
    const parlamentares = assiduidade.map(p => p.get({ plain: true }));
    let parlamentaresEditados = {};
    parlamentares.forEach((p)=>{
      let pp = p.assiduidadeParlamentar;
      let id = pp.idParlamentarVoz;
      if(!parlamentaresEditados[id]) parlamentaresEditados[id] = {
        id: id, 
        nome: pp.nomeEleitoral, 
        uf: pp.uf, 
        partido: pp.parlamentarPartido.sigla, 
        totalSessoesDeliberativas:0,
        totalPresenca:0,
        foto: getFoto(pp)
      };
      parlamentaresEditados[id].totalSessoesDeliberativas += p.totalSessoesDeliberativas;
      parlamentaresEditados[id].totalPresenca += p.totalPresenca;
    });

    return res.status(SUCCESS).json(parlamentaresEditados);
  })
  .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

module.exports = router;