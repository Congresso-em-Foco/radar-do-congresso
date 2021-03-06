const express = require("express");
const router = express.Router();
const { validationResult } = require('express-validator');

const models = require("../../models/index");
const casaValidator = require("../../utils/middlewares/casa.validator");
const { formataVotacoes,getFoto } = require("../../utils/functions");

const Parlamentar = models.parlamentar;
const Proposicao = models.proposicao;
const Assiduidade = models.assiduidade;
const ParlamentarProposicao = models.parlamentarProposicao;
const Votacao = models.votacao;
const Voto = models.voto;
const Partido = models.partido;
const GastosCeap = models.gastosCeap;
const Patrimonio = models.patrimonio;
const Discursos = models.discursos;
const VotosEleicao = models.votosEleicao;
const Transparencia = models.transparencia;

const BAD_REQUEST = 400;
const SUCCESS = 200;

const attVotacao = ["voto", ["id_votacao", "idVotacao"]];
const att = [
  ["id_parlamentar_voz", "idParlamentarVoz"],
  ["id_parlamentar", "idParlamentar"],
  "casa",
  ["nome_eleitoral", "nomeEleitoral"],
  "uf",
  "genero",
  ["em_exercicio", "emExercicio"],
  "casa"
];
const attPartido = [["id_partido", "idPartido"], "sigla", "tipo"]
const attGastosCeap = [
  "categoria",
  "especificacao",
  ["data_emissao", "dataEmissao"],
  "fornecedor",
  "valor_gasto"
];
const attAssiduidade = [
  "ano",
  ["dias_com_sessoes_deliberativas", "totalSessoesDeliberativas"], 
  ["dias_presentes", "totalPresenca"], 
  ["dias_ausencias_justificadas", "totalAusenciasJustificadas"],
  ["dias_ausencias_nao_justificadas", "totalAusenciasNaoJustificadas"]
];

/**
 * Recupera informações sobre os parlamentares
 * @name get/api/parlamentares
 * @function
 * @memberof module:routes/parlamentares
 */
router.get("/", (req, res) => {
  Parlamentar.findAll({
    include: [{
      model: Partido,
      as: "parlamentarPartido",
      attributes: attPartido,
    }],
    where: {
      casa: 'camara'
    }
  })
    .then(parlamentares => res.json(parlamentares))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega os partidos distintos de um estado
 * @name get/api/parlamentares/partidos
 * @apiparam Casa Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
 * @memberof module:routes/parlamentares 
 */
router.get("/partidos", casaValidator.validate, (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(BAD_REQUEST).json({ errors: errors.array() });
  }

  const casa = req.param("casa") || "camara"

  Parlamentar.findAll({
    attributes: att,
    where: {
      em_exercicio: true,
      casa: casa
    },
    include: [{
      model: Partido,
      as: "parlamentarPartido"
    }]
  })
    .then(parlamentares => {
      let partidosPorEstado = []

      const estados = [...new Set(parlamentares.map(item => item.uf))];

      estados.push("Estados");

      estados.forEach(estado => {
        let parlamentaresFiltered;
        if (estado !== "Estados")
          parlamentaresFiltered = parlamentares.filter(value => value.uf === estado);
        else
          parlamentaresFiltered = parlamentares;

        const partidosSet = new Set();

        parlamentaresFiltered.forEach(cand => {
          partidosSet.add(cand.parlamentarPartido.sigla);
        });

        partidosPorEstado.push({ estado: estado, partidos: [...partidosSet].sort((a, b) => a.localeCompare(b)) });
      });

      res.json(partidosPorEstado);
    })
    .catch(err => res.status(BAD_REQUEST).json({ error: err.message }));
});


/**
 * Recupera informações do mapeamento ID do parlamentar e o id na plataforma Radar do Congresso
 * @name get/api/parlamentares
 * @function
 * @memberof module:routes/parlamentares
 */
router.get("/mapeamento-id", (req, res) => {
  Parlamentar
    .findAll({
      attributes: ["id_parlamentar", "id_parlamentar_voz"]
    })
    .then(parlamentares => res.status(SUCCESS).json(parlamentares))
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Recupera todos os parlamentares por casa com dados simplificados, assiduidade e transparencia
 * @name get/api/parlamentares/simplificado
 * @function
 * @memberof module:routes/parlamentares
 */
router.get("/simplificado", casaValidator.validate, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(BAD_REQUEST).json({ errors: errors.array() });

  const casa = req.param("casa") || "camara";

  Parlamentar.findAll({
    include: [
      {
        model: Partido,
        as: "parlamentarPartido",
        attributes: attPartido,
      },
      {
        model: Assiduidade,
        as: "parlamentarAssiduidade",
        attributes: attAssiduidade,
      },
      {
        model: Transparencia,
        as: "transparenciaParlamentar",
        attributes: ["estrelas"]
      }
    ],
    where: {
      casa: casa,
      em_exercicio: true
    }
  })
  .then(parlamentares => {

    const ps = parlamentares.map(p => p.get({ plain: true }));
    let parlamentaresEditados = {};

    ps.forEach((p)=>{

      let id = p.id_parlamentar_voz;
      if(!parlamentaresEditados[id]) parlamentaresEditados[id] = {
        id: id, 
        nome: p.nome_eleitoral, 
        uf: p.uf, 
        genero: p.genero,
        partido: p.parlamentarPartido.sigla, 
        sessoes:0,
        presenca:0,
        foto: getFoto(p),
        transparencia: p.transparenciaParlamentar ? p.transparenciaParlamentar.estrelas : null
      };
      p.parlamentarAssiduidade.forEach(a=>{
        parlamentaresEditados[id].sessoes += a.totalSessoesDeliberativas;
        parlamentaresEditados[id].presenca += a.totalPresenca;
      });
    });

    return res.json(parlamentaresEditados);
  })
  .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Recupera parlamentar por id com dados simplificados, assiduidade e transparencia
 * @name get/api/parlamentares/simplificado/:id
 * @function
 * @memberof module:routes/parlamentares
 * @param {string} id - id do parlamentar na plataforma Radar do Congresso
 */
router.get("/simplificado/:id", (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(BAD_REQUEST).json({ errors: errors.array() });

  Parlamentar.findAll({
    include: [
      {
        model: Partido,
        as: "parlamentarPartido",
        attributes: attPartido,
      },
      {
        model: Assiduidade,
        as: "parlamentarAssiduidade",
        attributes: attAssiduidade,
      },
      {
        model: Transparencia,
        as: "transparenciaParlamentar",
        attributes: ["estrelas"]
      }
    ],
    where: {
      id_parlamentar_voz: req.params.id,
      em_exercicio: true
    }
  })
  .then(parlamentares => {

    const ps = parlamentares.map(p => p.get({ plain: true }));
    let editado = {};

    ps.forEach((p)=>{
      let id = p.id_parlamentar_voz;
      editado = {
        id: id, 
        nome: p.nome_eleitoral,
        casa: p.casa,
        uf: p.uf, 
        genero: p.genero,
        partido: p.parlamentarPartido.sigla, 
        sessoes:0,
        presenca:0,
        foto: getFoto(p),
        transparencia: p.transparenciaParlamentar ? p.transparenciaParlamentar.estrelas : null
      };
      p.parlamentarAssiduidade.forEach(a=>{
        editado.sessoes += a.totalSessoesDeliberativas;
        editado.presenca += a.totalPresenca;
      });
    });

    Votacao.findAll({
      attributes: [
        ["data_hora","data"],
        "orientacao"
      ],
      include: [
        {
          model: Voto,
          attributes: [
            ["id_parlamentar_voz","id"],
            "voto"
          ],
          as: "votacoesVoto",
          where: { id_parlamentar_voz: req.params.id },
          required: true
        }
      ],
      order: [
        ["data_hora", "ASC"],
        ["id_votacao", "ASC"],
      ],
    })
    .then(governismo => {
      let cDate = new Date(2019,0,0);
      let gGeral = {afavor:0,n:0,nvotacoes:0,trimestral:{}};
      
      governismo.forEach(
        t => {
          //data, orientacao, votacoesVoto
          //id, voto
          if(new Date(t.dataValues.data+" 00:00") >= cDate){
            new Date(cDate.setMonth(cDate.getMonth()+3));
          }
          let dd = cDate.toISOString()
          
          if(!gGeral["trimestral"][dd]) gGeral["trimestral"][dd] = {afavor:0,n:0,total:0,nvotacoes:0};
          gGeral.nvotacoes++;
          gGeral["trimestral"][dd].nvotacoes++;

          t.votacoesVoto.forEach(voto=>{
            let v = voto.dataValues;

            let afavor = false;
            let conta = false;
            if( (t.orientacao == v.voto && v.voto == 1) || (t.orientacao == v.voto && v.voto == -1) ){
              afavor = 1;
            }
            if( ([1,-1].indexOf(t.orientacao) != -1) && ([1,-1,2,3].indexOf(v.voto) != -1) ){
              conta = 1;
            }

            if(afavor) gGeral["trimestral"][dd].afavor ++;
            if(conta) gGeral["trimestral"][dd].n ++;
            gGeral["trimestral"][dd].total = Math.round(gGeral["trimestral"][dd].afavor/gGeral["trimestral"][dd].n*100);

            if(afavor) gGeral.afavor++;
            if(conta) gGeral.n ++;
            gGeral.total = Math.round(gGeral.afavor/gGeral.n*100);
          });
        }    
      );
      editado.governismo = gGeral.total;
      return res.json(editado);
    });

  })
  .catch(err => res.status(BAD_REQUEST).json({ err }));
});


/**
 * Recupera informações do parlamentar de acordo com o id (no Radar do Congresso).
 * @name get/api/parlamentares/:id
 * @function
 * @memberof module:routes/parlamentares
 * @param {string} id - id do parlamentar na plataforma Radar do Congresso
 */
router.get("/:id", (req, res) => {
  Parlamentar.findAll({
    where: {
      id_parlamentar_voz: req.params.id
    }
  })
    .then(parlamentar => res.json(parlamentar))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});


/**
* Recupera informações básicas do parlamentar de acordo com o id (no Radar do Congresso).
* @name get/api/parlamentares/:id/info
* @function
* @memberof module:routes/parlamentares
* @param {string} id - id do parlamentar na plataforma Radar do Congresso
*/
router.get("/:id/info", (req, res) => {
  Parlamentar.findOne({
    attributes: [
      "id_parlamentar_voz",
      "id_parlamentar",
      "casa",
      "nome_eleitoral",
      "uf",
      "em_exercicio",
      ["data_nascimento", "dataNascimento"],
      "naturalidade",
      "genero",
      "endereco",
      "telefone",
      "email"
    ],
    where: {
      id_parlamentar_voz: req.params.id
    },
    include: [
      {
        model: Partido,
        as: "parlamentarPartido",
        attributes: attPartido
      },
      {
        model: Transparencia,
        as: "transparenciaParlamentar",
        attributes: ["estrelas"]
      }
    ]
  })
    .then(parlamentar => res.json(parlamentar))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Recupera informações de votos (usados para o cálculo da aderência) do parlamentar a partir de seu id (no Radar do Congresso)
 * @name get/api/parlamentares/:id/votos
 * @function
 * @memberof module:routes/parlamentares
 * @param {string} id - id do parlamentar na plataforma Radar do Congresso
 */
router.get("/:id/votos", (req, res) => {
  Parlamentar.findAll({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"]],
    include: [
      {
        model: Voto,
        as: "votos",
        attributes: attVotacao,
        required: false,
        include: [{
          model: Votacao,
          as: "votoVotacao",
          attributes: [],
          required: true,
          include: [{
            model: Proposicao,
            as: "votacoesProposicoes",
            attributes: [],
            required: true
          }]
        }]
      }
    ],
    where: { id_parlamentar_voz: req.params.id }
  })
    .then(votacoes => {
      novaVotacao = formataVotacoes(votacoes);
      return res.json(novaVotacao[0]);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Recupera informações de gastos de ceap para um parlamentar a partir de seu id
 * @name get/api/parlamentares/:id/gastos-ceap
 * @function
 * @memberof module:routes/parlamentares
 * @param {string} id - id do parlamentar na plataforma Radar
 */
router.get("/:id/gastos-ceap", (req, res) => {
  Parlamentar.findOne({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"]],
    include: [
      {
        model: GastosCeap,
        attributes: attGastosCeap,
        as: "parlamentarGastosCeap"
      }
    ],
    where: { id_parlamentar_voz: req.params.id }
  })
    .then(parlamentar => {
      return res.json(parlamentar);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Recupera informações de proposições autoradas por um parlamentar a partir de seu id
 * @name get/api/parlamentares/:id/proposicoes
 * @function
 * @memberof module:routes/parlamentares
 * @param {string} id - id do parlamentar na plataforma Radar do Congresso
 */
router.get("/:id/proposicoes", (req, res) => {
  Parlamentar.findOne({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"]],
    include: [
      {
        model: ParlamentarProposicao,
        attributes: [["id_proposicao_voz", "idProposicaoVoz"]],
        as: "proposicaoAutores",
        required: false,
        include: [{
          model: Proposicao,
          attributes: [["id_proposicao", "idProposicao"], "casa", "nome", "ementa"],
          as: "proposicaoDetalhes",
          required: true
        }]
      }
    ],
    where: { id_parlamentar_voz: req.params.id }
  })
    .then(parlamentar => {
      return res.json(parlamentar);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Recupera informações de assiduidade de um parlamentar a partir de seu id
 * @name get/api/parlamentares/:id/assiduidade
 * @function
 * @memberof module:routes/parlamentares
 * @param {string} id - id do parlamentar na plataforma Radar do Congresso
 */
router.get("/:id/assiduidade", (req, res) => {
  Parlamentar.findOne({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"]],
    include: [
      {
        model: Assiduidade,
        attributes: attAssiduidade,
        as: "parlamentarAssiduidade"
      }
    ],
    where: { id_parlamentar_voz: req.params.id }
  })
    .then(parlamentar => {
      return res.json(parlamentar);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Recupera informações de discursos autoradas por um parlamentar a partir de seu id
 * @name get/api/parlamentares/:id/discursos
 * @function
 * @memberof module:routes/parlamentares
 * @param {string} id - id do parlamentar na plataforma Radar do Congresso
 */
router.get("/:id/discursos", (req, res) => {
  Parlamentar.findOne({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"]],
    include: [
      {
        model: Discursos,
        attributes: ["casa", "tipo", "data", "resumo", "link"],
        as: "parlamentarDiscursos",
      }
    ],
    order: [
      ['parlamentarDiscursos', 'data', 'DESC']
    ],
    where: { id_parlamentar_voz: req.params.id }
  })
    .then(parlamentar => {
      return res.json(parlamentar);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Recupera informações de patrimônio declarado por um parlamentar ao TSE a partir de seu id
 * @name get/api/parlamentares/:id/patrimonio
 * @function
 * @memberof module:routes/parlamentares
 * @param {string} id - id do parlamentar na plataforma Radar do Congresso
 */
router.get("/:id/patrimonio", (req, res) => {
  Parlamentar.find({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"]],
    include: [
      {
        model: Patrimonio,
        attributes: [["ano_eleicao", "anoEleicao"], ["ds_cargo", "cargo"], ["ds_tipo_bem", "tipoBem"],
        ["ds_bem", "descricaoBem"], ["valor_bem", "valorBem"]],
        as: "parlamentarPatrimonio",
      }
    ],
    order: [
      ['parlamentarPatrimonio', 'valor_bem', 'DESC']
    ],
    where: { id_parlamentar_voz: req.params.id }
  })
    .then(parlamentar => {
      return res.json(parlamentar.parlamentarPatrimonio);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Recupera informações de votos na eleição para um parlamentar a partir de seu id
 * @name get/api/parlamentares/:id/eleicao
 * @function
 * @memberof module:routes/parlamentares
 * @param {string} id - id do parlamentar na plataforma Radar do Congresso
 */
router.get("/:id/eleicao", (req, res) => {
  VotosEleicao.findOne({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"], "casa", "ano", ["total_votos", "totalVotos"], "uf",
    ["total_votos_uf", "totalVotosUF"]],
    include: [
      {
        model: Partido,        
        as: "votosEleicaoPartido",
        attributes: ["sigla"]
      }
    ],
    where: { id_parlamentar_voz: req.params.id }
  })
    .then(parlamentar => {
      return res.json(parlamentar);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});


module.exports = router;
