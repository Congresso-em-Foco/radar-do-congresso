interface ProposicaoDetalhes {
    idProposicao: string;
    casa: string;
    nome: string;
    ementa: string;
}

interface ProposicoesAutor {
    idProposicaoVoz: string;
    proposicaoDetalhes: ProposicaoDetalhes;
}

export interface ParlamentarProposicoes {
  idParlmentarVoz: string;
  proposicaoAutores: ProposicaoDetalhes[];
}
