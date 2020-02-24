module.exports = (sequelize, type) => {
  discursos = sequelize.define(
    "discursos",
    {
      id_discurso: {
        type: type.INTEGER,
        primaryKey: true
      },
      id_parlamentar_voz: type.STRING,
      casa: type.STRING,
      tipo: type.STRING,
      data: type.DATE,
      local: type.STRING,
      resumo: type.STRING,
      link: type.STRING
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );

  discursos.associate = function (models) {
    discursos.belongsTo(models.parlamentar, {
      foreignKey: "id_parlamentar_voz",
      sourceKey: "id_parlamentar_voz",      
      as: "discursosParlamentares"
    })
  };
  return discursos;
};
  