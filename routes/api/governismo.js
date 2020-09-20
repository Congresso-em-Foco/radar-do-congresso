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
  "em_exercicio",
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
        required: true,
        include: [{
          model: Parlamentar,
          attributes: [],
          as: "votoParlamentar",
          //required: true,
          //where: {em_exercicio: true}
        }]
      }
    ]
  })
  .then(governismo => {
    let cDate = new Date(2019,0,0);
    let gGeral = {afavor:0,n:0,nvotacoes:0,trimestral:{},parlamentares:{}};
    governismo.forEach(
      t => {
        if(new Date(t.dataValues.data+" 00:00") >= cDate){
          new Date(cDate.setMonth(cDate.getMonth()+3));
        }
        let dd = cDate.toISOString()
        
        if(!gGeral["trimestral"][dd]) gGeral["trimestral"][dd] = {afavor:0,n:0,total:0};
        gGeral.nvotacoes++;

        t.votacoesVoto.forEach(voto=>{
          let v = voto.dataValues;
          if(v.voto == t.orientacao) gGeral["trimestral"][dd].afavor ++;
          gGeral["trimestral"][dd].n ++;
          gGeral["trimestral"][dd].total = Math.round(gGeral["trimestral"][dd].afavor/gGeral["trimestral"][dd].n*100);

          if(v.voto == t.orientacao) gGeral.afavor++;
          gGeral.n ++;
          gGeral.total = Math.round(gGeral.afavor/gGeral.n*100);

          //Parlamentar
          if(!gGeral["parlamentares"][v["id"]]) gGeral["parlamentares"][v["id"]] = {id:v["id"],afavor:0,n:0,total:0,trimestral:{}};
          if(!gGeral["parlamentares"][v["id"]].trimestral[dd]) gGeral["parlamentares"][v["id"]].trimestral[dd] = {afavor:0,n:0,total:0};
          if(v.voto == t.orientacao) gGeral["parlamentares"][v["id"]].trimestral[dd].afavor ++;
          gGeral["parlamentares"][v["id"]].trimestral[dd].n ++;
          gGeral["parlamentares"][v["id"]].trimestral[dd].total = Math.round(gGeral["parlamentares"][v["id"]].trimestral[dd].afavor/gGeral["parlamentares"][v["id"]].trimestral[dd].n*100);

          if(v.voto == t.orientacao) gGeral["parlamentares"][v["id"]].afavor ++;
          gGeral["parlamentares"][v["id"]].n ++;
          gGeral["parlamentares"][v["id"]].total = Math.round(gGeral["parlamentares"][v["id"]].afavor/gGeral["parlamentares"][v["id"]].n*100);
        });
      }    
    );

    return res.status(SUCCESS).json(gGeral);
  })
  .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

router.get("/:id", (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  Votacao.findAll({
    attributes: attVotacao,
    include: [
      {
        model: Voto,
        attributes: attVoto,
        as: "votacoesVoto",
        where: { id_parlamentar_voz: req.params.id },
        required: true
      }
    ]
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
        
        if(!gGeral["trimestral"][dd]) gGeral["trimestral"][dd] = {afavor:0,n:0,total:0};
        gGeral.nvotacoes++;

        t.votacoesVoto.forEach(voto=>{
          let v = voto.dataValues;
          if(v.voto == t.orientacao) gGeral["trimestral"][dd].afavor ++;
          gGeral["trimestral"][dd].n ++;
          gGeral["trimestral"][dd].total = Math.round(gGeral["trimestral"][dd].afavor/gGeral["trimestral"][dd].n*100);

          if(v.voto == t.orientacao) gGeral.afavor++;
          gGeral.n ++;
          gGeral.total = Math.round(gGeral.afavor/gGeral.n*100);
        });
      }    
    );

    return res.status(SUCCESS).json(gGeral);
  })
  .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));

});


module.exports = router;
