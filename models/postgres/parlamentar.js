module.exports = (sequelize, type) => {
    parlamentar = sequelize.define(
      "parlamentare",
      {
        id_parlamentar_voz: {
            type: type.STRING,
            primaryKey: true
        },
        id_parlamentar: type.STRING,
        casa: type.STRING,
        cpf: type.STRING,
        nome_civil: type.STRING,
        nome_eleitoral: type.STRING,
        genero: type.STRING,
        uf: type.STRING,
        id_partido: type.STRING,
        situacao: type.STRING,
        condicao_eleitoral: type.STRING,
        ultima_legislatura: type.STRING,
        em_exercicio: type.BOOLEAN
      },
      {
        timestamps: false
      }
    );
    parlamentar.associate = function (models) {
      parlamentar.belongsTo(models.partido, {
        foreignKey: "id_partido",
        targetKey: "id_partido",      
        as: "parlamentarPartido"
      }),
      parlamentar.hasMany(models.gastosCeap, {
        foreignKey: "id_parlamentar_voz",
        targetKey: "id_parlamentar_voz",      
        as: "parlamentarGastosCeap"
      }),
      parlamentar.hasMany(models.parlamentarProposicao, {
        foreignKey: "id_parlamentar_voz",
        targetKey: "id_parlamentar_voz",
        as: "proposicaoAutores"
      }),
      parlamentar.hasMany(models.patrimonio, {
        foreignKey: "id_parlamentar_voz",
        targetKey: "id_parlamentar_voz",
        as: "parlamentarPatrimonio"
      }),
      parlamentar.hasMany(models.voto, {
        foreignKey: "id_parlamentar_voz",
        targetKey: "id_parlamentar_voz",
        as: "votos"
      });      
      parlamentar.hasMany(models.discursos, {
        foreignKey: "id_parlamentar_voz",
        targetKey: "id_parlamentar_voz",
        as: "parlamentarDiscursos"
      })
    };

    return parlamentar;
  };
  