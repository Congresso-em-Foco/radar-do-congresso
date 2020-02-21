import { ProposicaoInfo } from './proposicaoInfo.model';

export interface ParlamentarProposicoes {
  idParlamentarVoz: string;
  proposicaoAutores: ProposicaoInfo[];
}
