function formataVotacoes(resultado) {
  const resultadoNovo = resultado.map(cand => cand.get({ plain: true }));
  
  resultadoNovo.forEach(cand => {
    const votos = {};
    cand.votos.forEach(vot => {
      votos[vot.idVotacao] = vot.voto;
    });
    cand.votos = votos;    
  });
  return resultadoNovo;
}

function calculaAssiduidade(resultado) {
  const parlamentares = resultado.map(parlamentar => parlamentar.get({ plain: true }));

  const groupBy = (array, key) => {
    return array.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  let resultadoNovo = groupBy(parlamentares, "ano");

  let data = [];

  for (let ano in resultadoNovo) {
    let obj = {}
    obj.ano = ano;
    obj.parlamentares = resultadoNovo[ano];

    obj.parlamentares.forEach(parlamentar => {
      const percentualPresenca = parlamentar.totalPresenca / parlamentar.totalSessoesDeliberativas;
      const percentualAusenciasJustificadas = parlamentar.totalAusenciasJustificadas / parlamentar.totalSessoesDeliberativas;
      const percentualAusenciasNaoJustificadas = parlamentar.totalAusenciasNaoJustificadas / parlamentar.totalSessoesDeliberativas;
    
      parlamentar.Presenca = percentualPresenca;
      //parlamentar.totalAusenciasJustificadas = percentualAusenciasJustificadas;
      //parlamentar.totalAusenciasNaoJustificadas = percentualAusenciasNaoJustificadas;

      delete parlamentar.ano;
    });

    data.push(obj);
}

  return data;
}

module.exports = {
  formataVotacoes,
  calculaAssiduidade
}