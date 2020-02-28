import { Votacao } from './votacao.model';
import { Tema } from './tema.model';

export interface Proposicao {
  nome: string;
  idProposicao: number;
  casa: string;
  titulo: string;
  descricao: string;
  temas: Tema[];
  proposicaoVotacoes: Votacao[];
}
