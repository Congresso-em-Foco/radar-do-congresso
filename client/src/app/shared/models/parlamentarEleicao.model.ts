export interface ParlamentarEleicao {
  idParlamentarVoz: string;
  casa: string;
  ano: number;
  totalVotos: number;
  uf: string;
  totalVotosUF: number;
  proporcaoVotos: number;
  votosEleicaoPartido: any;
}
