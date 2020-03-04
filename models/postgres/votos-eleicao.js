module.exports = (sequelize, type) => {
  votosEleicao = sequelize.define(
    "votos_eleicao",
    {
      id_parlamentar_voz: {
        type: type.STRING,
        primaryKey: true
      },
      casa: type.STRING,
      ano: {
        type: type.INTEGER,
        primaryKey: true
      },
      uf: type.STRING,
      id_partido: type.STRING,
      total_votos: type.INTEGER,
      total_votos_uf: type.INTEGER
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );

  votosEleicao.associate = function (models) {
    votosEleicao.belongsTo(models.parlamentar, {
      foreignKey: "id_parlamentar_voz",
      sourceKey: "id_parlamentar_voz",
      as: "votosEleicaoParlamentares"
    }),
    votosEleicao.belongsTo(models.partido, {
      foreignKey: "id_partido",
      targetKey: "id_partido",      
      as: "votosEleicaoPartido"
    })
  };
  return votosEleicao;
};
