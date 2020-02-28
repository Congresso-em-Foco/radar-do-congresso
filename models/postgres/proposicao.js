module.exports = (sequelize, type) => {
  proposicao = sequelize.define(
    "proposicoes",
    {
      id_proposicao_voz: {
        type: type.STRING,
        primaryKey: true
      },
      id_proposicao: type.STRING,      
      casa: type.STRING,
      nome: type.STRING,
      ano: type.STRING,
      ementa: type.STRING,
      url: type.STRING
    },
    {
      timestamps: false,
      freezeTableName: true
    },    
  );
  proposicao.associate = function(models) {
    proposicao.hasMany(models.parlamentarProposicao, {
      foreignKey: "id_proposicao_voz",
      targetKey: "id_proposicao_voz",
      as: "proposicaoAutores"
    }),
    proposicao.hasMany(models.votacao, {
      foreignKey: "id_proposicao_voz",
      targetKey: "id_proposicao_voz",
      as: "proposicaoVotacoes"
    });
  };

  return proposicao;
};
