module.exports = (sequelize, type) => {
  partido = sequelize.define(
    "partido",
    {
      id_partido: {
        type: type.INTEGER,
        primaryKey: true
      },
      sigla: type.STRING,
      tipo: type.STRING,
      situacao: type.STRING
    },
    {
      timestamps: false
    }
  );
  partido.associate = function (models) {
    partido.hasMany(models.parlamentar, {
      foreignKey: "id_partido",
      targetKey: "id_partido",
      as: "parlamentarPartido"
    }),
    partido.hasMany(models.votosEleicao, {
      foreignKey: "id_partido",
      targetKey: "id_partido",
      as: "votosEleicaoPartido"
    })
  };
  return partido;
};
