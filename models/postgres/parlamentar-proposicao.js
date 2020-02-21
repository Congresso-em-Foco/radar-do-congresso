module.exports = (sequelize, type) => {
  parlamentarProposicao = sequelize.define(
    "parlamentares_proposicoes",
    {
      id_proposicao_voz: {
        type: type.STRING,
        primaryKey: true
      },
      id_parlamentar_voz: {
        type: type.STRING,
        primaryKey: true
      },
      ordem_assinatura: type.STRING
    },
    {
      timestamps: false,
      freezeTableName: true
    },
  );
  parlamentarProposicao.associate = function (models) {
    parlamentarProposicao.belongsTo(models.parlamentar, {
      foreignKey: "id_parlamentar_voz",
      sourceKey: "id_parlamentar_voz",      
      as: "parlamentarAutor"
    }),
    parlamentarProposicao.belongsTo(models.proposicao, {
      foreignKey: "id_proposicao_voz",
      sourceKey: "id_proposicao_voz",      
      as: "proposicaoDetalhes"
    })
  };

  return parlamentarProposicao;
};
