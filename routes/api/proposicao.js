const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");

const models = require("../../models/index");
const casaValidator = require("../../utils/middlewares/casa.validator");

const Proposicao = models.proposicao;
const Votacao = models.votacao;
const Voto = models.voto;
const Parlamentar = models.parlamentar;
const Partido = models.partido;

const BAD_REQUEST = 400;
const SUCCESS = 200;

const attVotacao = [
  ["id_votacao", "idVotacao"],
  ["obj_votacao", "objetoVotacao"],
  "apelido",
  ["data_hora", "data"],
  ["votacao_secreta", "votacaoSecreta"]
];

const attVoto = [["id_votacao", "idVotacao"], "voto"];

const attParlamentar = [
  ["nome_eleitoral", "nomeEleitoral"],
  ["uf", "uf"]
];

const attPartido = ["sigla"];

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

  const casa = req.param("casa") || "camara";

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

router.get("/importantes", (req, res) => {
  Proposicao.findAll({
    include: [
      {
        model: Votacao,
        attributes: attVotacao,
        as: "proposicaoVotacoes",
        required: true,
        where: {
          status_importante: true
        },
        include: [
          {
            model: Proposicao,
            as: "votacoesProposicoes"
          }
        ]
      }
    ]
  })
    .then(proposicoes => {
      return res.status(SUCCESS).json(proposicoes);
    })
    .catch(err => res.status(BAD_REQUEST).json(err));
});

router.get("/importantes/votos", (req, res) => {
  Votacao.findAll({
    attributes: attVotacao,
    where: { status_importante: true },
    include: [
      {
        model: Voto,
        attributes: attVoto,
        as: "votacoesVoto",
        required: true,
        include: [
          {
            model: Parlamentar,
            attributes: attParlamentar,
            as: "votoParlamentar",
            required: true,
            include: [
              {
                model: Partido,
                attributes: attPartido,
                as: "parlamentarPartido",
                required: true
              }
            ]
          }
        ]
      }
    ]
  })
    .then(votacoes => {
      return res.status(SUCCESS).json(votacoes);
    })
    .catch(err => res.status(BAD_REQUEST).json(err));
});

module.exports = router;
