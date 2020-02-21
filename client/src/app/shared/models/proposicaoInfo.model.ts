interface ProposicaoDetalhes {
    idProposicao: string;
    casa: string;
    nome: string;
    ementa: string;
}

export interface ProposicaoInfo {
    idProposicaoVoz: string;
    proposicaoDetalhes: ProposicaoDetalhes;
}
