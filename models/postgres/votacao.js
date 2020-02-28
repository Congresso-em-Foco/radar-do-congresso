module.exports = (sequelize, type) => {
  const votacao = sequelize.define(
    "votacoes",    
    {
      id_votacao: {
        type: type.STRING,
        primaryKey: true
      },
      id_proposicao_voz: type.STRING,
      casa: type.STRING,
      obj_votacao: type.STRING,
      data_hora: type.DATE,
      votacao_secreta: type.BOOLEAN,
      url_votacao: type.INTEGER
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );
  votacao.associate = function(models) {
    votacao.belongsTo(models.proposicao, {
      foreignKey: "id_proposicao_voz",
      sourceKey: "id_proposicao_voz",
      as: "votacoesProposicoes"
    }),
    votacao.hasMany(models.voto, {
      foreignKey: "id_votacao",
      sourceKey: "id_votacao",
      as: "votacoesVoto"
    })
  };
  return votacao;
};
