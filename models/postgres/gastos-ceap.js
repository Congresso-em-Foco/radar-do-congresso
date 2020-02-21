module.exports = (sequelize, type) => {
  gastosCeap = sequelize.define(
    "gastos_ceap",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true
      },
      id_parlamentar_voz: type.STRING,
      casa: type.STRING,
      ano: type.INTEGER,
      mes: type.INTEGER,
      documento: type.STRING,
      categoria: type.STRING,
      especificacao: type.STRING,
      data_emissao: type.DATE,
      fornecedor: type.STRING,
      cnpj_cpf_fornecedor: type.STRING,
      valor_gasto: type.DECIMAL(15, 2)
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );

  gastosCeap.associate = function (models) {
    gastosCeap.belongsTo(models.parlamentar, {
      foreignKey: "id_parlamentar_voz",
      targetKey: "id_parlamentar_voz",      
      as: "gastosCeapParlamentares"
    })
  };
  return gastosCeap;
};
