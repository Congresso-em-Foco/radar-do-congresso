module.exports = (sequelize, type) => {
  transparencia = sequelize.define(
    "transparencia",
    {
      id_parlamentar_voz: {
        type: type.STRING,
        primaryKey: true
      },
      casa: type.STRING,
      estrelas: type.INTEGER,
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );

  transparencia.associate = function (models) {
    transparencia.belongsTo(models.parlamentar, {
      foreignKey: "id_parlamentar_voz",
      sourceKey: "id_parlamentar_voz",      
      as: "transparenciaParlamentar"
    })
  };
  return transparencia;
};
  