import { Votacao } from './votacao.model';

export interface Proposicao {
  nome: string;
  idProposicao: number;
  casa: string;
  titulo: string;
  descricao: string;
  proposicaoVotacoes: Votacao[];
}
