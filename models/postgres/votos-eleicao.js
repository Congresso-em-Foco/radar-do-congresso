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
      total_votos: type.INTEGER,
      total_votos_uf: type.INTEGER,
      proporcao_votos: type.REAL
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
    })
  };
  return votosEleicao;
};
