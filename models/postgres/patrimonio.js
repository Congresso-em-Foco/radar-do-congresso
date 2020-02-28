module.exports = (sequelize, type) => {
    patrimonio = sequelize.define(
      "patrimonio",
      {
        id_patrimonio: {
          type: type.INTEGER,
          primaryKey: true
        },
        id_parlamentar_voz: type.STRING,
        casa: type.STRING,
        ano_eleicao: type.INTEGER,
        ds_cargo: type.STRING,
        ds_tipo_bem: type.STRING,
        ds_bem: type.STRING,
        valor_bem: type.DECIMAL(15, 2)
      },
      {
        timestamps: false,
        freezeTableName: true
      }
    );
  
    patrimonio.associate = function (models) {
      patrimonio.belongsTo(models.parlamentar, {
        foreignKey: "id_parlamentar_voz",
        sourceKey: "id_parlamentar_voz",      
        as: "patrimonioParlamentares"
      })
    };
    return patrimonio;
  };
  