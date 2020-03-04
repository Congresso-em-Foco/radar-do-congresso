module.exports = (sequelize, type) => {
  assiduidade = sequelize.define(
    "assiduidade",
    {
      id_parlamentar_voz: {
        type: type.STRING,
        primaryKey: true
      },
      ano: {
        type: type.INTEGER,
        primaryKey: true
      },
      dias_com_sessoes_deliberativas: type.INTEGER,
      dias_presentes: type.INTEGER,
      dias_ausencias_justificadas: type.INTEGER,
      dias_ausencias_nao_justificadas: type.INTEGER,
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );

  assiduidade.associate = function (models) {
    assiduidade.belongsTo(models.parlamentar, {
      foreignKey: "id_parlamentar_voz",
      sourceKey: "id_parlamentar_voz",      
      as: "assiduidadeParlamentar"
    })
  };
  return assiduidade;
};
  