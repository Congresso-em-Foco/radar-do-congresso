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

module.exports = {
  formataVotacoes
}