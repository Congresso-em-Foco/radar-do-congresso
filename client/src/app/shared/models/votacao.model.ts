export interface Votacao {
  idVotacao: number;
  objetoVotacao: string;
  data: string;
  idProposicao: number;
  nomeProposicao: string;
  votacaoSecreta: boolean;
}
